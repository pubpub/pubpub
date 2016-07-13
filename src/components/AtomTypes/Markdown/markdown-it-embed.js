var UNESCAPE_RE = /\\([ \\!#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;

var OPENING_CHAR = 0x5B; /* [ */
var CLOSING_CHAR = 0x5D; /* ] */

function embed(state, silent) {
  var found,
      content,
      token,
      max = state.posMax,
      start = state.pos;

  if (state.src.charCodeAt(start) !== OPENING_CHAR) { return false; }
  if (start + 4 >= max) { return false; }
  if (state.src.charCodeAt(start+1) !== OPENING_CHAR) { return false; }


  if (silent) { return false; } // don't run any pairs in validation mode

  state.pos = start + 2;

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos - 1) === CLOSING_CHAR && state.src.charCodeAt(state.pos) === CLOSING_CHAR) {
      found = true;
      break;
    }

    state.md.inline.skipToken(state);
  }



  // if (!found || start + 1 === state.pos) {
  if (!found) {
    state.pos = start;
    return false;
  }

  content = state.src.slice(start + 2, state.pos - 1);

  state.posMax = state.pos;
  state.pos = start + 1;

  token         = state.push('embed', '', 0);
  token.content = content.replace(UNESCAPE_RE, '$1');
  token.attrs = [];
  var regex = /([a-zA-Z]+)="((?:[^"\\]|\\.)*)"/g;
  var result;
  while (result = regex.exec(token.content)) {
    token.attrs.push([result[1], result[2]]);
  }

  state.pos = state.posMax + 1;
  state.posMax = max;
  return true;
}


module.exports = function embed_plugin(md) {
  md.inline.ruler.push('embed', embed);
};
