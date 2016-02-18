'use strict';


module.exports = function container_plugin(md, name, options) {

  options = options || {};

  var min_markers = 3,
      marker_str  = options.marker || '-',
      marker_char = marker_str.charCodeAt(0),
      marker_len  = marker_str.length,
      render      = options.render

  function container(state, startLine, endLine, silent) {
    var pos, nextLine, marker_count, markup, params, token,
        old_parent, old_line_max,
        auto_closed = false,
        start = state.bMarks[startLine] + state.tShift[startLine],
        max = state.eMarks[startLine];

    // Open pubheader on first line of doc
    if (state.parentType !== 'root' || start !== 0) { return false; }

    // Since start is found, we can report success here in validation mode
    if (silent) { return true; }

    // Search for the end of the block
    nextLine = startLine;

    for (;;) {
      nextLine++;
      if (nextLine >= endLine) {
        // unclosed block should be autoclosed by end of document.
        // also block seems to be autoclosed by end of parent
        break;
      }

      start = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];

      // non-empty line with negative indent should stop the list:
      if (start < max && state.sCount[nextLine] < state.blkIndent) {
        break;
      }

      // If it's not a closing char, continue
      if (marker_char !== state.src.charCodeAt(start)) { continue; }

      // closing fence should be indented less than 4 spaces
      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        continue;
      }

      // closing code fence must be at least as long as the opening one
      if (Math.floor((pos - start) / marker_len) < 3) { continue; }

      // make sure tail has spaces only
      pos -= (pos - start) % marker_len;
      pos = state.skipSpaces(pos);
      if (pos < max) { continue; }

      // found!
      auto_closed = true;
      break;
    }

    old_parent = state.parentType;
    old_line_max = state.lineMax;
    state.parentType = 'pubheader';

    // this will prevent lazy continuations from ever going past our end marker
    state.lineMax = nextLine;

    token        = state.push('pubheader_open', 'pubheader', 1);
    token.markup = markup;
    token.block  = true;
    token.info   = params;
    token.map    = [ startLine, nextLine ];

    state.md.block.tokenize(state, startLine + 1, nextLine);

    token        = state.push('pubheader_close', 'pubheader', -1);
    token.markup = state.src.slice(start, pos);
    token.block  = true;

    state.parentType = old_parent;
    state.lineMax = old_line_max;
    state.line = nextLine + (auto_closed ? 1 : 0);

    return true;
  }

  md.block.ruler.before('fence', 'pubheader', container, {
    alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
  });
  md.renderer.rules['pubheader_open'] = render;
  md.renderer.rules['pubheader_close'] = render;
};