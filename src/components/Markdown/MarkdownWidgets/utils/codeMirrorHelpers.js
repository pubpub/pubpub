
// Compares two codemirror positions to see if they're equal or ont
export function checkEqualPositions(aIndex, bIndex) {
  return (aIndex.line === bIndex.line && aIndex.ch === bIndex.ch);
}

// Returns true if aPos appears before bPos
export function checkFirstPosition(aPos, bPos) {
  if (aPos.line < bPos.line) {
    return true;
  } else if (aPos.line === bPos.line && aPos.ch <= bPos.ch) {
    return true;
  } else {
    return false;
  }
}
