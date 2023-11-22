// Creates a virtual element to be manipulated in the FiberTree
export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'object'
          ? child
          : _createTextElement(child)
      ),
    },
  };
}

// An alternate version of a virtual element that represents text, not a DOM node
function _createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
