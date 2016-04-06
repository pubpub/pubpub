var UNESCAPE_RE = /\\([ \\!#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;

var OPENING_CHAR = 0x5B; /* [ */
var CLOSING_CHAR = 0x5D; /* ] */

function ppm(state, silent) {
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

  // don't allow unescaped spaces/newlines inside
  /*
  if (content.match(/(^|[^\\])(\\\\)*\s/)) {
    state.pos = start;
    return false;
  }
  */

  /*
  state.posMax = state.pos;
  state.pos = start + 1;

  // Earlier we checked !silent, but this implementation does not need it
  token         = state.push('sub_open', 'sub', 1);
  token.markup  = '~';

  token         = state.push('text', '', 0);
  token.content = content.replace(UNESCAPE_RE, '$1');

  token         = state.push('sub_close', 'sub', -1);
  token.markup  = '~';

  state.pos = state.posMax + 1;
  state.posMax = max;
  */

  // found!
  state.posMax = state.pos;
  state.pos = start + 1;

  // Earlier we checked !silent, but this implementation does not need it
  token         = state.push('ppm_open', 'ppm', 1);
  token.markup  = '[[';

  token         = state.push('ppm_content', '', 0);
  token.content = content.replace(UNESCAPE_RE, '$1');
  // debugger;
  token         = state.push('ppm_close', 'ppm', -1);
  token.markup  = ']]';

  state.pos = state.posMax + 1;
  state.posMax = max;
  return true;
}


module.exports = function ppm_plugin(md) {
  md.inline.ruler.before('math_inline', 'ppm', ppm);
  // md.inline.ruler.push('ppm', ppm);
};
