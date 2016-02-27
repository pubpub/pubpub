// Lists

'use strict';

function isSpace(code) {
  switch (code) {
    case 0x09:
    case 0x20:
      return true;
  }
  return false;
}


// Search `[-+*][\n ]`, returns next pos arter marker on success
// or -1 on fail.
function skipClassAndColonMarker(state, startLine) {
  var marker, pos, max, ch;

  pos = state.bMarks[startLine] + state.tShift[startLine];
  max = state.eMarks[startLine];

  var start = pos;

  // Check bullet
  console.log('------------');
  while (pos < max) {
    marker = state.src.charCodeAt(pos);

    console.log('marker, pos', marker, pos);
    if (marker === 58/* : */ ) {
      console.log('gunna break');
      console.log('pos is ', pos);
      pos++;
      break;
    }
    pos++;
  }
  

  if (pos < max) {
    ch = state.src.charCodeAt(pos);

    if (!isSpace(ch)) {
      // " -test " - is not a list item
      console.log('gunna return -1');
      return -1;
    }
  }
  console.log('char at pos ', state.src.charAt(pos));
  console.log('gunna return ', pos);
  console.log('the marker string is', state.src.substring(start, pos));
  return pos;
}

// // Search `\d+[.)][\n ]`, returns next pos arter marker on success
// // or -1 on fail.
// function skipOrderedListMarker(state, startLine) {
//   var ch,
//       start = state.bMarks[startLine] + state.tShift[startLine],
//       pos = start,
//       max = state.eMarks[startLine];

//   // List marker should have at least 2 chars (digit + dot)
//   if (pos + 1 >= max) { return -1; }

//   ch = state.src.charCodeAt(pos++);

//   if (ch < 0x30/* 0 */ || ch > 0x39/* 9 */) { return -1; }

//   for (;;) {
//     // EOL -> fail
//     if (pos >= max) { return -1; }

//     ch = state.src.charCodeAt(pos++);

//     if (ch >= 0x30/* 0 */ && ch <= 0x39/* 9 */) {

//       // List marker should have no more than 9 digits
//       // (prevents integer overflow in browsers)
//       if (pos - start >= 10) { return -1; }

//       continue;
//     }

//     // found valid marker
//     if (ch === 0x29/* ) */ || ch === 0x2e/* . */) {
//       break;
//     }

//     return -1;
//   }


//   if (pos < max) {
//     ch = state.src.charCodeAt(pos);

//     if (!isSpace(ch)) {
//       // " 1.test " - is not a list item
//       return -1;
//     }
//   }
//   return pos;
// }

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

module.exports = function pubheaderitem_plugin(md, name, options) {
  options = options || {};
  var render = options.render;
  console.log('renderer', render);

  function pubheaderitem(state, startLine, endLine, silent) {


    // check start line for colon
    // find end line (first line of same depth with colon)
    // tokenize the innards
    // set state to continue on 'calcEndLine to endLine'
    // set state.line to be next line


    console.log('state', state);
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
        isItem,
        contentStart,
        listTokIdx,
        prevEmptyEnd,
        listLines,
        itemLines,
        tight = true,
        terminatorRules,
        token,
        i, l, terminate;

    // if (state.parentType !== 'pubheader' && state.parentType !== 'pubheaderitem') { return false; }
    if (state.parentType !== 'pubheader') { return false; }
    
    // Detect list type and position after marker
    if ((posAfterMarker = skipClassAndColonMarker(state, startLine)) >= 0) {
      isItem = true;
      console.log('position after marker is', posAfterMarker);
    // } else if ((posAfterMarker = skipBulletListMarker(state, startLine)) >= 0) {
    //   isOrdered = false;
    } else {
      return false;
    }

    
    token        = state.push('pubheaderitem_open', 'pubheaderitem', 1);
    token.map    = itemLines = [ startLine, 2 ];
    state.md.block.tokenize(state, startLine, startLine + 2, true);
    token        = state.push('pubheaderitem_close', 'pubheaderitem', -1);
    state.line = startLine + 3;

    return true;






    // We should terminate list on style change. Remember first one to compare.
    markerCharCode = state.src.charCodeAt(posAfterMarker - 1);
    console.log(markerCharCode);

    // For validation mode we can terminate immediately
    if (silent) { return true; }

    // Start list
    listTokIdx = state.tokens.length;

    // if (isOrdered) {
    //   start = state.bMarks[startLine] + state.tShift[startLine];
    //   markerValue = Number(state.src.substr(start, posAfterMarker - start - 1));

    //   token       = state.push('ordered_list_open', 'ol', 1);
    //   if (markerValue !== 1) {
    //     token.attrs = [ [ 'start', markerValue ] ];
    //   }

    // } else {
      // token       = state.push('pubheaderitem_open', 'pubheaderitem', 1);
    // }

    // token.map    = listLines = [ startLine, 0 ];
    // token.markup = String.fromCharCode(markerCharCode);
    // console.log ('token.markup', token.markup);

    //
    // Iterate list items
    //

    nextLine = startLine;
    prevEmptyEnd = false;
    terminatorRules = state.md.block.ruler.getRules('list');
    console.log('nextLine', nextLine);
    console.log('endLine', endLine);
    
    while (nextLine < endLine) {
      pos = posAfterMarker;
      max = state.eMarks[nextLine];
      console.log('line is', state.src.substring(pos, max));

      initial = offset = state.sCount[nextLine] + posAfterMarker - (state.bMarks[startLine] + state.tShift[startLine]);

      while (pos < max) {
        ch = state.src.charCodeAt(pos);
        console.log('ch', ch, state.src.charAt(pos));
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
      indent = initial + indentAfterMarker;

      // Run subparser & write tokens
      token        = state.push('pubheaderitem_open', 'pubheaderitem', 1);
      token.markup = String.fromCharCode(markerCharCode);
      token.map    = itemLines = [ startLine, 0 ];

      oldIndent = state.blkIndent;
      oldTight = state.tight;
      oldTShift = state.tShift[startLine];
      oldLIndent = state.sCount[startLine];
      oldParentType = state.parentType;
      state.blkIndent = indent;
      state.tight = true;
      state.parentType = 'pubheaderitem';
      state.tShift[startLine] = contentStart - state.bMarks[startLine];
      state.sCount[startLine] = offset;

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
      state.tight = oldTight;
      state.parentType = oldParentType;

      token        = state.push('pubheaderitem_close', 'pubheaderitem', -1);
      token.markup = String.fromCharCode(markerCharCode);


      nextLine = startLine = state.line;
      itemLines[1] = nextLine;
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
          terminate = true;
          break;
        }
      }
      if (terminate) { break; }

      // fail if list has another type
      // if (isOrdered) {
      //   posAfterMarker = skipOrderedListMarker(state, nextLine);
      //   if (posAfterMarker < 0) { break; }
      // } else {
      //   posAfterMarker = skipBulletListMarker(state, nextLine);
      //   if (posAfterMarker < 0) { break; }
      // }

      if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) { break; }
    }

    // Finilize list
    // if (isOrdered) {
      // token = state.push('pubheaderitem_close', 'pubheaderitem', -1);
    // } else {
      // token = state.push('pubheaderitem_close', 'pubheaderitem', -1);
    // }
    // token.markup = String.fromCharCode(markerCharCode);

    // listLines[1] = nextLine;
    state.line = nextLine;

    // mark paragraphs tight if needed
    if (tight) {
      markTightParagraphs(state, listTokIdx);
    }

    return true;
  };

  md.block.ruler.before('fence', 'pubheaderitem', pubheaderitem, {});

  md.renderer.rules['pubheaderitem_open'] = render;
  md.renderer.rules['pubheaderitem_close'] = render;

};
