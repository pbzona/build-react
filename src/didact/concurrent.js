import { createDom } from './render';

/*
  Singletons for managing state
  - WorkManager helps other parts know which work to process in the render phase
  - FiberTree is basically the virtual DOM, keeps track of rendered nodes
*/

// Keep track of the current and next unit of work to be done
export const WorkManager = (function () {
  let _nextUnitOfWork = null;

  return {
    getNextUnit: function () {
      return _nextUnitOfWork;
    },
    setNextUnit: function (value) {
      _nextUnitOfWork = value;
      return _nextUnitOfWork;
    },
  };
})();

// Keep track of current Fiber tree's work progress
// (Analogous to the virtual DOM)
export const FiberTree = (function () {
  let _wipRoot = null;

  return {
    getWipRoot: function () {
      return _wipRoot;
    },
    setWipRoot: function (value) {
      _wipRoot = value;
      return _wipRoot;
    },
  };
})();

/*
  Internal helpers
*/

// Updates the FiberTree state as it is written to the browser
function _commitRoot() {
  let wipRoot = FiberTree.getWipRoot();
  _commitWork(wipRoot.child);

  // Reset the tree after committing
  FiberTree.setWipRoot(null);
}

// Writes the fiber tree to the browser DOM
function _commitWork(fiber) {
  if (!fiber) {
    return;
  }

  // Recursively append nodes to the DOM
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  _commitWork(fiber.child);
  _commitWork(fiber.sibling);
}

// Does the rendering one part at a time, until interrupted
export function _performUnitOfWork(fiber) {
  // Use the fiber to create a node and append it to the DOM
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  // For each child, create a new fiber
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }

  // Find the next unit of work
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

// Does work until the browser needs the main thread back, then pauses
export function workLoop(deadline) {
  let shouldYield = false;
  let nextUnitOfWork = WorkManager.getNextUnit();

  // As long as there is work and browser doesn't need the thread back, continue to process
  while (nextUnitOfWork && !shouldYield) {
    WorkManager.setNextUnit(_performUnitOfWork(nextUnitOfWork));
    shouldYield = deadline.timeRemaining() < 1;
  }

  let wipRoot = FiberTree.getWipRoot();
  // We know work is finished because there is no next unit
  if (!nextUnitOfWork && wipRoot) {
    _commitRoot();
  }
  requestIdleCallback(workLoop);
}
