import ElementSchema from './elementSchema';
import {schema} from './schema';

const {wrapItem, blockTypeItem, Dropdown, DropdownSubmenu, joinUpItem, liftItem,
       selectParentNodeItem, undoItem, redoItem, icons, MenuItem} = require("prosemirror-menu")
const {createTable, addColumnBefore, addColumnAfter,
       removeColumn, addRowBefore, addRowAfter, removeRow} = require("prosemirror-schema-table")
const {toggleMark} = require("prosemirror-commands")
const {wrapInList} = require("prosemirror-schema-list")
const {TextField, openPrompt} = require("./prompt")

// Helpers to create specific types of items

function canInsert(state, nodeType, attrs) {
  let $from = state.selection.$from
  for (let d = $from.depth; d >= 0; d--) {
    let index = $from.index(d)
    if ($from.node(d).canReplaceWith(index, index, nodeType, attrs)) return true
  }
  return false
}

function insertImageItem(nodeType) {
  return new MenuItem({
    title: "Insert image",
    label: "Image",
    select(state) { return canInsert(state, nodeType) },
    run(state, _, view) {
      let {node, from, to} = state.selection, attrs = nodeType && node && node.type == nodeType && node.attrs
      openPrompt({
        title: "Insert image",
        fields: {
          src: new TextField({label: "Location", required: true, value: attrs && attrs.src}),
          title: new TextField({label: "Title", value: attrs && attrs.title}),
          alt: new TextField({label: "Description",
                              value: attrs ? attrs.title : state.doc.textBetween(from, to, " ")})
        },
        // FIXME this (and similar uses) won't have the current state
        // when it runs, leading to problems in, for example, a
        // collaborative setup
        callback(attrs) {
          view.props.onAction(view.state.tr.replaceSelection(nodeType.createAndFill(attrs)).action())
        }
      })
    }
  })
}


const insertEmbed = (atomType, state, _, view, nodeType) => {
  let {node, from, to} = state.selection;
  let attrs = nodeType && node && node.type == nodeType && node.attrs;
	const idGenerationCallback = (nodeAttrs) => {
		const randomId = Math.floor(Math.random()*10000000);
		nodeAttrs.nodeId = randomId;
    view.props.onAction(view.state.tr.replaceSelection(nodeType.createAndFill(nodeAttrs)).action());
		// callback(nodeAttrs);
	};
  const nodesInDoc = ElementSchema.getElementsInDocument();

  if (atomType === 'reference') {
    window.toggleMedia(idGenerationCallback, schema.nodes.embed, atomType, nodesInDoc);
  } else {
    window.toggleMedia(idGenerationCallback, schema.nodes.block_embed, atomType, nodesInDoc);
  }

};

function insertImageEmbed(nodeType) {
  return new MenuItem({
    title: "Insert Image",
    label: "Image",
    select(state) { return canInsert(state, nodeType) },
    run(state, _, view) {
      insertEmbed('image', state, _, view, nodeType);
    }
  })
}

function insertReferenceEmbed(nodeType) {
  return new MenuItem({
    title: "Insert Reference",
    label: "Reference",
    select(state) { return canInsert(state, nodeType) },
    run(state, _, view) {
      insertEmbed('reference', state, _, view, nodeType);
    }
  })
}



function positiveInteger(value) {
  if (!/^[1-9]\d*$/.test(value)) return "Should be a positive integer"
}

function insertTableItem(tableType) {
  return new MenuItem({
    title: "Insert a table",
    run(_, _a, view) {
      openPrompt({
        title: "Insert table",
        fields: {
          rows: new TextField({label: "Rows", validate: positiveInteger}),
          cols: new TextField({label: "Columns", validate: positiveInteger})
        },
        callback({rows, cols}) {
          view.props.onAction(view.state.tr.replaceSelection(createTable(tableType, +rows, +cols)).scrollAction())
        }
      })
    },
    select(state) {
      let $from = state.selection.$from
      for (let d = $from.depth; d >= 0; d--) {
        let index = $from.index(d)
        if ($from.node(d).canReplaceWith(index, index, tableType)) return true
      }
      return false
    },
    label: "Table"
  })
}

function cmdItem(cmd, options) {
  let passedOptions = {
    label: options.title,
    run: cmd,
    select(state) { return cmd(state) }
  }
  for (let prop in options) passedOptions[prop] = options[prop]
  return new MenuItem(passedOptions)
}

function markActive(state, type) {
  let {from, to, empty} = state.selection
  if (empty) return type.isInSet(state.storedMarks || state.doc.marksAt(from))
  else return state.doc.rangeHasMark(from, to, type)
}

function markItem(markType, options) {
  let passedOptions = {
    active(state) { return markActive(state, markType) }
  }
  for (let prop in options) passedOptions[prop] = options[prop]
  return cmdItem(toggleMark(markType), passedOptions)
}

function linkItem(markType) {
  return markItem(markType, {
    title: "Add or remove link",
    icon: icons.link,
    run(state, onAction, view) {
      if (markActive(state, markType)) {
        toggleMark(markType)(state, onAction)
        return true
      }
      openPrompt({
        title: "Create a link",
        fields: {
          href: new TextField({
            label: "Link target",
            required: true,
            clean: (val) => {
              if (!/^https?:\/\//i.test(val))
                val = 'http://' + val
              return val
            }
          }),
          title: new TextField({label: "Title"})
        },
        callback(attrs) {
          toggleMark(markType, attrs)(view.state, view.props.onAction)
        }
      })
    }
  })
}

function wrapListItem(nodeType, options) {
  return cmdItem(wrapInList(nodeType, options.attrs), options)
}

// :: (Schema) → Object
// Given a schema, look for default mark and node types in it and
// return an object with relevant menu items relating to those marks:
//
// **`toggleStrong`**`: MenuItem`
//   : A menu item to toggle the [strong mark](#schema-basic.StrongMark).
//
// **`toggleEm`**`: MenuItem`
//   : A menu item to toggle the [emphasis mark](#schema-basic.EmMark).
//
// **`toggleCode`**`: MenuItem`
//   : A menu item to toggle the [code font mark](#schema-basic.CodeMark).
//
// **`toggleLink`**`: MenuItem`
//   : A menu item to toggle the [link mark](#schema-basic.LinkMark).
//
// **`insertImage`**`: MenuItem`
//   : A menu item to insert an [image](#schema-basic.Image).
//
// **`wrapBulletList`**`: MenuItem`
//   : A menu item to wrap the selection in a [bullet list](#schema-list.BulletList).
//
// **`wrapOrderedList`**`: MenuItem`
//   : A menu item to wrap the selection in an [ordered list](#schema-list.OrderedList).
//
// **`wrapBlockQuote`**`: MenuItem`
//   : A menu item to wrap the selection in a [block quote](#schema-basic.BlockQuote).
//
// **`makeParagraph`**`: MenuItem`
//   : A menu item to set the current textblock to be a normal
//     [paragraph](#schema-basic.Paragraph).
//
// **`makeCodeBlock`**`: MenuItem`
//   : A menu item to set the current textblock to be a
//     [code block](#schema-basic.CodeBlock).
//
// **`insertTable`**`: MenuItem`
//   : An item to insert a [table](#schema-table).
//
// **`addRowBefore`**, **`addRowAfter`**, **`removeRow`**, **`addColumnBefore`**, **`addColumnAfter`**, **`removeColumn`**`: MenuItem`
//   : Table-manipulation items.
//
// **`makeHead[N]`**`: MenuItem`
//   : Where _N_ is 1 to 6. Menu items to set the current textblock to
//     be a [heading](#schema-basic.Heading) of level _N_.
//
// **`insertHorizontalRule`**`: MenuItem`
//   : A menu item to insert a horizontal rule.
//
// The return value also contains some prefabricated menu elements and
// menus, that you can use instead of composing your own menu from
// scratch:
//
// **`insertMenu`**`: Dropdown`
//   : A dropdown containing the `insertImage` and
//     `insertHorizontalRule` items.
//
// **`typeMenu`**`: Dropdown`
//   : A dropdown containing the items for making the current
//     textblock a paragraph, code block, or heading.
//
// **`fullMenu`**`: [[MenuElement]]`
//   : An array of arrays of menu elements for use as the full menu
//     for, for example the [menu bar](#menu.MenuBarEditorView).
function buildMenuItems(schema) {
  let r = {}, type
  if (type = schema.marks.strong)
    r.toggleStrong = markItem(type, {title: "Toggle strong style", icon: icons.strong})
  if (type = schema.marks.em)
    r.toggleEm = markItem(type, {title: "Toggle emphasis", icon: icons.em})
  if (type = schema.marks.code)
    r.toggleCode = markItem(type, {title: "Toggle code font", icon: icons.code})
  if (type = schema.marks.link)
    r.toggleLink = linkItem(type)

  if (type = schema.nodes.block_embed)
    r.insertImageEmbed = insertImageEmbed(type)

  if (type = schema.nodes.embed)
    r.insertReferenceEmbed = insertReferenceEmbed(type)

  if (type = schema.nodes.bullet_list)
    r.wrapBulletList = wrapListItem(type, {
      title: "Wrap in bullet list",
      icon: icons.bulletList
    })
  if (type = schema.nodes.ordered_list)
    r.wrapOrderedList = wrapListItem(type, {
      title: "Wrap in ordered list",
      icon: icons.orderedList
    })
  if (type = schema.nodes.blockquote)
    r.wrapBlockQuote = wrapItem(type, {
      title: "Wrap in block quote",
      icon: icons.blockquote
    })
  if (type = schema.nodes.paragraph)
    r.makeParagraph = blockTypeItem(type, {
      title: "Change to paragraph",
      label: "Plain"
    })
  if (type = schema.nodes.code_block)
    r.makeCodeBlock = blockTypeItem(type, {
      title: "Change to code block",
      label: "Code"
    })
  if (type = schema.nodes.heading)
    for (let i = 1; i <= 10; i++)
      r["makeHead" + i] = blockTypeItem(type, {
        title: "Change to heading " + i,
        label: "Level " + i,
        attrs: {level: i}
      })
  if (type = schema.nodes.horizontal_rule) {
    let hr = type
    r.insertHorizontalRule = new MenuItem({
      title: "Insert horizontal rule",
      label: "Horizontal rule",
      select(state) { return canInsert(state, hr) },
      run(state, onAction) { onAction(state.tr.replaceSelection(hr.create()).action()) }
    })
  }
  if (type = schema.nodes.table)
    r.insertTable = insertTableItem(type)
  if (type = schema.nodes.table_row) {
    r.addRowBefore = cmdItem(addRowBefore, {title: "Add row before"})
    r.addRowAfter = cmdItem(addRowAfter, {title: "Add row after"})
    r.removeRow = cmdItem(removeRow, {title: "Remove row"})
    r.addColumnBefore = cmdItem(addColumnBefore, {title: "Add column before"})
    r.addColumnAfter = cmdItem(addColumnAfter, {title: "Add column after"})
    r.removeColumn = cmdItem(removeColumn, {title: "Remove column"})
  }

  let cut = arr => arr.filter(x => x)
  r.insertMenu = new Dropdown(cut([r.insertHorizontalRule, r.insertTable, r.insertImageEmbed, r.insertReferenceEmbed]), {label: "Insert"})
  r.typeMenu = new Dropdown(cut([r.makeParagraph, r.makeCodeBlock, r.makeHead1 && new DropdownSubmenu(cut([
    r.makeHead1, r.makeHead2, r.makeHead3, r.makeHead4, r.makeHead5, r.makeHead6
  ]), {label: "Heading"})]), {label: "Type..."})
  let tableItems = cut([r.addRowBefore, r.addRowAfter, r.removeRow, r.addColumnBefore, r.addColumnAfter, r.removeColumn])
  if (tableItems.length)
    r.tableMenu = new Dropdown(tableItems, {label: "Modify Table"})

  r.inlineMenu = [cut([r.toggleStrong, r.toggleEm, r.toggleCode, r.toggleLink]), [r.insertMenu]]
  r.blockMenu = [cut([r.typeMenu, r.tableMenu, r.wrapBulletList, r.wrapOrderedList, r.wrapBlockQuote, liftItem])]
  r.fullMenu = r.inlineMenu.concat(r.blockMenu)

  return r
}
exports.buildMenuItems = buildMenuItems
