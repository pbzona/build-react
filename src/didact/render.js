import { WorkManager, FiberTree } from './concurrent';

// Translates the Fiber abstraction into real DOM nodes
export function createDom(fiber) {
  const dom =
    fiber.type == 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type);

  const isProperty = (key) => key !== 'children';
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });

  return dom;
}

// Entrypoint to the process by which JSX is translated and written to the DOM
export function render(element, container) {
  FiberTree.setWipRoot({
    dom: container,
    props: {
      children: [element],
    },
  });

  // Set the next unit of work - when the main thread is available, the workLoop will process it
  WorkManager.setNextUnit(FiberTree.getWipRoot());
}
