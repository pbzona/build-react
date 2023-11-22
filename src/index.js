import App from './App';
import Didact from './didact';

const container = document.getElementById('root');

// Next time the browser main thread is available, execute the workLoop callback
requestIdleCallback(Didact.workLoop);

/** @jsx Didact.createElement */
Didact.render(App, container);
