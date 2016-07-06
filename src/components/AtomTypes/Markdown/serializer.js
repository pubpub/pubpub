import {MarkdownSerializer} from 'prosemirror/dist/markdown';

export const defaultMarkdownSerializer = new MarkdownSerializer({
  blockquote(state, node) {
    state.wrapBlock("> ", null, node, () => state.renderContent(node))
  },
  code_block(state, node) {
    if (node.attrs.params == null) {
      state.wrapBlock("    ", null, node, () => state.text(node.textContent, false))
    } else {
      state.write("```" + node.attrs.params + "\n")
      state.text(node.textContent, false)
      state.ensureNewLine()
      state.write("```")
      state.closeBlock(node)
    }
  },
  heading(state, node) {
    state.write(state.repeat("#", node.attrs.level) + " ")
    state.renderInline(node)
    state.closeBlock(node)
  },
  horizontal_rule(state, node) {
    state.write(node.attrs.markup || "---")
    state.closeBlock(node)
  },
  bullet_list(state, node) {
    state.renderList(node, "  ", () => (node.attrs.bullet || "*") + " ")
  },
  ordered_list(state, node) {
    let start = node.attrs.order || 1
    let maxW = String(start + node.childCount - 1).length
    let space = state.repeat(" ", maxW + 2)
    state.renderList(node, space, i => {
      let nStr = String(start + i)
      return state.repeat(" ", maxW - nStr.length) + nStr + ". "
    })
  },
  list_item(state, node) {
    state.renderContent(node)
  },
  paragraph(state, node) {
    state.renderInline(node)
    state.closeBlock(node)
  },

  image(state, node) {
    state.write("![" + state.esc(node.attrs.alt || "") + "](" + state.esc(node.attrs.src) +
                (node.attrs.title ? " " + state.quote(node.attrs.title) : "") + ")")
  },
  hard_break(state) {
    state.write("\\\n")
  },
  text(state, node) {
    state.text(node.text)
  }
}, {
  em: {open: "*", close: "*", mixable: true},
  strong: {open: "**", close: "**", mixable: true},
  link: {
    open: "[",
    close(state, mark) {
      return "](" + state.esc(mark.attrs.href) + (mark.attrs.title ? " " + state.quote(mark.attrs.title) : "") + ")"
    }
  },
  code: {open: "`", close: "`"}
})