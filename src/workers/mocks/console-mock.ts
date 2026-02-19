/**
 * Browser console mock injected into the sandboxed Function() execution context.
 *
 * Captures all console.log / warn / error / info calls into `__consoleLogs`.
 */
export const CONSOLE_MOCK = `
var __consoleLogs = [];
function __serialize(a) {
  if (a === undefined) return 'undefined';
  if (a === null) return 'null';
  try { return typeof a === 'object' ? JSON.stringify(a) : String(a); } catch (e) { return String(a); }
}
var console = {
  log:   function() { __consoleLogs.push({ type: 'log',   args: Array.prototype.slice.call(arguments).map(__serialize).join(' ') }); },
  warn:  function() { __consoleLogs.push({ type: 'warn',  args: Array.prototype.slice.call(arguments).map(__serialize).join(' ') }); },
  error: function() { __consoleLogs.push({ type: 'error', args: Array.prototype.slice.call(arguments).map(__serialize).join(' ') }); },
  info:  function() { __consoleLogs.push({ type: 'info',  args: Array.prototype.slice.call(arguments).map(__serialize).join(' ') }); },
};
`;
