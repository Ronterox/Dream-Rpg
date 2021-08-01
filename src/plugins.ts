// Avoid `console` errors in browsers that lack a console.

let method;
const noop = function () {};
const methods = [
  'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
  'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
  'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
  'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
];
let size = methods.length;
const consoleMethods = window.console || {};

while (size--)
{
  method = methods[size];
  // Only stub undefined methods.
  if (!consoleMethods[method]) consoleMethods[method] = noop;
}
