import {schema as pubSchema} from './schema';

exports.createSimpleEditor = (place, doc) => {
  const {pubpubSetup} = require('./pubpubSetup');
  const {EditorState} = require('prosemirror-state');
  const {EditorView} = require('prosemirror-view');
  // const {clipboardParser, clipboardSerializer} = require('./proseEditor/clipboardSerializer');

  /*
  const state = EditorState.create({
    // doc: pubSchema.nodeFromJSON(this.collab.doc.contents),
  	plugins: [pubpubSetup({schema: pubSchema})],
  });
  */
  let view;
  try {
    view = new EditorView(place, {
      state: EditorState.create({schema: pubSchema}),
      onAction: action => view.updateState(view.state.applyAction(action)),
    	spellcheck: true,
    });
  } catch (err) {
    console.log('Could not create Editor!', err);
  }


  return {
    view: view,
    toJSON: () => {
      return view.state.doc.toJSON();
    },
    toMarkdown: () => {
      return '';
    },
    focus: () => {
      view.focus();
    },
  };

}
