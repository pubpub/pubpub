const {insertCSS} = require('prosemirror/dist/util/dom');
const className = 'ProseMirror-pubpub-setup-style';
exports.className = className;
// const scope = "." + cls + " .ProseMirror-content"
// ${scope} img { cursor: default; }

insertCSS(`

.ProseMirror:after {
  display: table;
  clear: both;
  content: "";
}

.ProseMirror-menubar {
  z-index: 2;
  background-color: transparent;
}

.ProseMirror-content {
  outline: none;
  min-height: 600px;
  padding: 0em 0em 1em 0em;
}

.ProseMirror-quick-style .ProseMirror-content{
  padding: .5em 1em;
  min-height: 3em;
}

@media screen and (min-resolution: 3dppx), screen and (max-width: 767px) {
  .ProseMirror-content {
    padding: 0em 0.5em 1em 0.5em;
  }
  .ProseMirror-quick-style .ProseMirror-content {
    padding: .5em;
  }
}

.ProseMirror-selectednode {
  outline: none;
}

.ProseMirror-menubar {
  color: #AAA;
  font-family: 'Open Sans';
  font-size: 0.85em;
  border: 0px solid black;
  height: 39px;
  padding: 0px 6px;
}

.ProseMirror-icon {
  line-height: inherit;
  display: block;
  height: 39px;
  line-height: 30px;
  padding: 0px 10px;
}

.ProseMirror-quick-style .ProseMirror-icon {
  height: auto;
  padding: 0em .5em;
}

.ProseMirror-icon svg {
  position: relative;
  top: 6px;
}

.ProseMirror-icon:hover {
  color: #222;
}

.ProseMirror-icon.ProseMirror-menu-active {
  background: transparent;
  color: black;
}

.ProseMirror-menu-dropdown:after {
  content: none;
}

.ProseMirror-menu-dropdown {
  display: block;
  padding: 2px 15px;
  height: 33px;
}
.ProseMirror-quick-style .ProseMirror-menu-dropdown {
  padding: 0em .5em;
  height: auto;
}

.ProseMirror-menu-dropdown-menu {
  font-family: 'Open Sans';
  font-size: 0.6em;
  margin-top: -4px;
}

.ProseMirror-menuseparator {
  margin: 0px 10px;
  position: relative;
  top: 5px;
}

.ProseMirror-tooltip, .ProseMirror-tooltip-pointer {
  transition: none;
  -webkit-transition: none;
  -moz-transition: none;
}

.ProseMirror-quick-style .ProseMirror-menuseparator {
  top: 0px;
}

.ProseMirror-quick-style .ProseMirror-tooltip {
  height: 26px;
  font-size: 0.8em;
  line-height: 1.4em;
  border-radius: 1px;
  border: 1px solid #808284;
}

`);
