// Lists

'use strict';
module.exports = function pubheaderitem_plugin(md, name, options) {

  function isSpace(code) {
    switch (code) {
      case 0x09:
      case 0x20:
        return true;
    }
    return false;
  }

  function skipClassAndColonMarker(state, startLine) {
    var marker, pos, max, ch;

    pos = state.bMarks[startLine] + state.tShift[startLine];
    max = state.eMarks[startLine];

    var foundMarker = false;
    while (pos < max) {
      marker = state.src.charCodeAt(pos++);

      if (marker === 0x3A/* : */ ) {
        foundMarker = true;
        break;
      }
    }

    if (!foundMarker) {
      return -1;
    }
    

    if (pos < max) {
      ch = state.src.charCodeAt(pos);

      if (!isSpace(ch)) {
        // " -test " - is not a list item
        return -1;
      }
    }
    return pos;
  }


  function markTightParagraphs(state, idx) {
    var i, l,
        level = state.level + 2;

    for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
      if (state.tokens[i].level === level && state.tokens[i].type === 'paragraph_open') {
        state.tokens[i + 2].hidden = true;
        state.tokens[i].hidden = true;
        i += 2;
      }
    }
  }




  options = options || {};
  // var render = options.render;
  // console.log('renderer', render);

  function pubheaderitem(state, startLine, endLine, silent) {
    var nextLine,
        initial,
        offset,
        indent,
        oldTShift,
        oldIndent,
        oldLIndent,
        oldTight,
        oldParentType,
        start,
        posAfterMarker,
        ch,
        pos,
        max,
        indentAfterMarker,
        markerValue,
        markerCharCode,
        isOrdered,
        contentStart,
        listTokIdx,
        prevEmptyEnd,
        listLines,
        itemLines,
        tight = true,
        terminatorRules,
        token,
        i, l, terminate;

    if (state.parentType !== 'pubheader' && state.parentType !== 'pubheaderitem') { return false; }

    // Detect position after marker
    if ( (posAfterMarker = skipClassAndColonMarker(state, startLine)) < 0) {
      return false;
    }

    var startpos = state.bMarks[startLine] + state.tShift[startLine];
    // console.log('string youre testing ', state.src.substring(startpos, posAfterMarker));
    if (state.src.substring(startpos, posAfterMarker).indexOf(' ') > -1) { return false;}

    // We should terminate list on style change. Remember first one to compare.
    markerCharCode = state.src.charCodeAt(posAfterMarker - 1);

    // For validation mode we can terminate immediately
    if (silent) { return true; }

    // Start list
    listTokIdx = state.tokens.length;

    token       = state.push('pubheaderitem_open', 'pubheaderitem', 1);
    // token.attrPush([ 'className', 'wubaluba' ]);
    token.map    = listLines = [ startLine, 0 ];
    token.markup = String.fromCharCode(markerCharCode);

    //
    // Iterate items
    //
    nextLine = startLine;
    prevEmptyEnd = false;
    terminatorRules = state.md.block.ruler.getRules('list');

    while (nextLine < endLine) {
      pos = posAfterMarker;
      max = state.eMarks[nextLine];

      initial = offset = state.sCount[nextLine] + posAfterMarker - (state.bMarks[startLine] + state.tShift[startLine]);

      while (pos < max) {
        ch = state.src.charCodeAt(pos);
        if (isSpace(ch)) {
          if (ch === 0x09) {
            offset += 4 - offset % 4;
          } else {
            offset++;
          }
        } else {
          break;
        }

        pos++;
      }

      contentStart = pos;

      if (contentStart >= max) {
        // trimming space in "-    \n  3" case, indent is 1 here
        indentAfterMarker = 1;
      } else {
        indentAfterMarker = offset - initial;
      }

      // If we have more than 4 spaces, the indent is 1
      // (the rest is just indented code block)
      if (indentAfterMarker > 4) { indentAfterMarker = 1; }

      // "  -  test"
      //  ^^^^^ - calculating total length of this thing
        
      var mpos = state.bMarks[startLine] + state.tShift[startLine];
      var mmax = state.eMarks[startLine]
      // console.log('this line: ', state.src.substring(mpos, mmax));
      // console.log('this line classLength: ', state.src.substring(mpos, mmax).split(':')[0].trim().length);
      var classLength = state.src.substring(mpos, mmax).split(':')[0].trim().length;
      token.attrPush([ 'className', state.src.substring(mpos, mmax).split(':')[0].trim() ]);

      indent = initial + indentAfterMarker - classLength;
      // console.log('indent', indent);
      offset = offset - classLength;

      

      // Run subparser & write tokens

      oldIndent = state.blkIndent;
      oldTight = state.tight;
      oldTShift = state.tShift[startLine];
      oldLIndent = state.sCount[startLine];
      oldParentType = state.parentType;
      state.blkIndent = indent;
      state.tight = false;
      state.parentType = 'pubheaderitem';
      state.bMarks[startLine] += classLength;
      state.tShift[startLine] = contentStart - state.bMarks[startLine];
      state.sCount[startLine] = offset;

      // console.log('---------');
      // console.log('this line: ', state.src.substring(mpos, mmax));
      // console.log('this line classLength: ', state.src.substring(mpos, mmax).split(':')[0].trim().length);
      // console.log('indentAfterMarker', indentAfterMarker);
      // console.log('indent', indent);
      // console.log('offset', offset);
      // console.log('state.tShift[startLine]', state.tShift[startLine]);
      // console.log('state.bMarks[startLine]', state.bMarks[startLine]);
      // console.log('contentStart', contentStart);
      // console.log('state.sCount[startLine]', state.sCount[startLine]);
      // console.log('---------');

      // debugger;
      if (contentStart >= max && state.isEmpty(startLine + 1)) {
        // workaround for this case
        // (list item is empty, list terminates before "foo"):
        // ~~~~~~~~
        //   -
        //
        //     foo
        // ~~~~~~~~
        state.line = Math.min(state.line + 2, endLine);
      } else {
        state.md.block.tokenize(state, startLine, endLine, true);
      }

      // If any of list item is tight, mark list as tight
      if (!state.tight || prevEmptyEnd) {
        tight = false;
      }
      // Item become loose if finish with empty line,
      // but we should filter last element, because it means list finish
      prevEmptyEnd = (state.line - startLine) > 1 && state.isEmpty(state.line - 1);

      state.blkIndent = oldIndent;
      state.tShift[startLine] = oldTShift;
      state.sCount[startLine] = oldLIndent;
      state.bMarks[startLine] -= classLength;
      state.tight = oldTight;
      state.parentType = oldParentType;

      nextLine = startLine = state.line;
      contentStart = state.bMarks[startLine];

      if (nextLine >= endLine) { break; }

      if (state.isEmpty(nextLine)) {
        break;
      }

      //
      // Try to check if list is terminated or continued.
      //
      if (state.sCount[nextLine] < state.blkIndent) { break; }

      // fail if terminating block found
      terminate = false;
      for (i = 0, l = terminatorRules.length; i < l; i++) {
        if (terminatorRules[i](state, nextLine, endLine, true)) {
          // console.log('Got a terminate');
          terminate = true;
          break;
        }
      }
      if (terminate) { break; }

      
      posAfterMarker = skipClassAndColonMarker(state, nextLine);
      if (posAfterMarker < 0) { break; }

      if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) { break; }
    }

    // Finilize list
    
    token = state.push('pubheaderitem_close', 'pubheaderitem', -1);
    token.markup = String.fromCharCode(markerCharCode);

    listLines[1] = nextLine;
    state.line = nextLine;

    // mark paragraphs tight if needed
    if (tight) {
      markTightParagraphs(state, listTokIdx);
    }

    return true;
  };

  md.block.ruler.before('fence', 'pubheaderitem', pubheaderitem, {
    alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
  });

};
