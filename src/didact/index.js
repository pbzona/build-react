import { createElement } from './createElement.js';
import { render } from './render.js';
import { WorkManager, workLoop } from './concurrent.js';

const Didact = {
  createElement,
  render,
  WorkManager,
  workLoop,
};

export default Didact;
