'use strict';


module.exports = function container_plugin(md, name, options) {

  options = options || {};

  var min_markers = 5,
      marker_str  = '-',
      marker_char = marker_str.charCodeAt(0),
      marker_len  = marker_str.length,
      render      = options.render

  function container(state, startLine, endLine, silent) {
    var pos, nextLine, marker_count, markup, params, token,
        old_parent, old_line_max,
        auto_closed = false,
        start = state.bMarks[startLine] + state.tShift[startLine],
        max = state.eMarks[startLine];

    // Only allow root-level
    if (state.parentType !== 'root') { return false; }

    // --------

    // Check out the first character quickly,
    // this should filter out most of non-containers
    //
    if (marker_char !== state.src.charCodeAt(start)) { return false; }

    // Check out the rest of the marker string
    //
    for (pos = start + 1; pos <= max; pos++) {
      if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
        break;
      }
    }

    marker_count = Math.floor((pos - start) / marker_len);
    if (marker_count < min_markers) { return false; }
    pos -= (pos - start) % marker_len;

    markup = state.src.slice(start, pos);
    params = state.src.slice(pos, max);
    // --------







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

      for (pos = start + 1; pos <= max; pos++) {
        if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
          break;
        }
      }

      // closing code fence must be at least as long as the opening one
      if (Math.floor((pos - start) / marker_len) < marker_count) { continue; }

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


    // token        = state.push('pubtitle_open', 'pubtitle', 1);
    // state.md.block.tokenize(state, startLine, startLine + 1);
    // token        = state.push('pubtitle_close', 'pubtitle', -1);

    state.md.block.tokenize(state, startLine + 1, nextLine); // Use this line to exclude the title line
    // state.md.block.tokenize(state, startLine + 1, nextLine); // Use this line to include the title line

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
