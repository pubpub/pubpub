const {insertCSS} = require("prosemirror/dist/util/dom");

const className = "ProseMirror-pubpub-setup-style"
exports.className = className
// const scope = "." + cls + " .ProseMirror-content"

insertCSS(`

.ProseMirror-menubar {
  color: #AAA;
  font-family: 'Open Sans';
  font-size: 0.7em;
}

.ProseMirror-icon {
  line-height: inherit;
  display: block;
}

.ProseMirror-icon:hover {
  color: #222;
}

.ProseMirror-icon.ProseMirror-menu-active {
  background: transparent;
  color: 'black';
}



`)

// ${scope} img { cursor: default; }
