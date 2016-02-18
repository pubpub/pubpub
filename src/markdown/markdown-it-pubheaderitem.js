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
    if (state.parentType !== 'pubheader') { return false; }
    console.log('Started pubitem loop!');
    // debugger;

    // Since start is found, we can report success here in validation mode
    if (silent) { return true; }

    // Search for the end of the block
    nextLine = startLine - 1;

    var foundName = null;
    var foundPos = null;
    var foundLine = null;
    var endPos = null;
    var endFoundLine = null;

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

      if (foundName) {
        for (var lineChar = start; lineChar < max; lineChar++) {
          if (state.src.charAt(lineChar) === ':') {
            endPos = start;
            endFoundLine = nextLine;
            auto_closed = true;
            break;
          }
        }
        if (endPos) {
          break;
        }
      }

      
      for (var lineChar = start; lineChar < max; lineChar++) {
        if (state.src.charAt(lineChar) === ':') {
          foundPos = lineChar;
          foundLine = nextLine;
          foundName = state.src.substring(start,lineChar);
          console.log(foundName);
          continue;
        }
      }


      if (nextLine === endLine - 1) {
        endPos = max;
        endFoundLine = nextLine;
        auto_closed = true;
        break;
      }
 
      //state.src.substring(start,max)


      // closing fence should be indented less than 4 spaces
      /*
      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        continue;
      }
      */


      // make sure tail has spaces only
      /*
      pos -= (pos - start) % marker_len;
      pos = state.skipSpaces(pos);
      if (pos < max) { continue; }

      // found!
      =
      */
    }

    old_parent = state.parentType;
    old_line_max = state.lineMax;
    state.parentType = 'pubitem';

    // this will prevent lazy continuations from ever going past our end marker
    state.lineMax = nextLine;

    token        = state.push('pubitem_open', 'pubitem', 1);
    token.markup = foundName;
    token.block  = true;
    token.info   = params;
    token.foundName = foundName;
    token.map    = [ foundLine, endFoundLine ];

    state.md.block.tokenize(state, foundLine, endFoundLine);

    token        = state.push('pubitem_close', 'pubitem', -1);
    //token.markup = state.src.slice(start, pos);
    token.markup = foundName;
    token.block  = true;

    state.parentType = old_parent;
    state.lineMax = old_line_max;
    state.line = nextLine;

    return true;
  }

  md.block.ruler.before('fence', 'pubheaderitem', container, {
    alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
  });
  md.renderer.rules['pubheaderitem_open'] = render;
  md.renderer.rules['pubheaderitem_close'] = render;
};