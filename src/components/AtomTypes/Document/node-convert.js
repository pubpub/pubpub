/* To convert to and from how the document is stored in the database to how ProseMirror expects it.
We use the DOM import for ProseMirror as the JSON we store in the database is really jsonized HTML.
*/
import {node2Obj, obj2Node} from './jsonExporter';
import {parseDOM} from 'prosemirror/dist/model/from_dom';

export let modelToEditor = function(doc, schema) {
  // We start with a document of which we use the metadata and contents entries.
  let editorNode = document.createElement('div');
  let contentsNode = obj2Node(doc.contents);

  /*
  let editorNode = document.createElement('div'),
  contentsNode = obj2Node(doc.contents),
  subtitleNode = doc.metadata.subtitle ? obj2Node(doc.metadata.subtitle) : document.createElement('div'),
  authorsNode = doc.metadata.authors ? obj2Node(doc.metadata.authors) : document.createElement('div'),
  abstractNode = doc.metadata.abstract ? obj2Node(doc.metadata.abstract) : document.createElement('div'),
  keywordsNode = doc.metadata.keywords ? obj2Node(doc.metadata.keywords) : document.createElement('div')



  titleNode.id = 'document-title'
  subtitleNode.id = 'metadata-subtitle'
  authorsNode.id = 'metadata-authors'
  abstractNode.id = 'metadata-abstract'
  keywordsNode.id = 'metadata-keywords'
  */
  contentsNode.id = 'document-contents';


  editorNode.appendChild(contentsNode)

  // In order to stick with the format used in Fidus Writer 1.1-2.0,
  // we do a few smaller modifications to the node before it is saved.

  let pmDoc = parseDOM(schema, editorNode, {
    preserveWhitespace: true,
  });

  return pmDoc;
};


export let editorToModel = function(pmDoc) {
  // In order to stick with the format used in Fidus Writer 1.1-2.0,
  // we do a few smaller modifications to the node before it is saved.
  let node = pmDoc.content.toDOM();
  // We convert the node into a json object with two entries: metadata and contents
  let doc = {
    metadata: {},
  };
  /*
  doc.metadata.title = node2Obj(node.querySelector('#document-title'))
  doc.metadata.subtitle = node2Obj(node.querySelector('#metadata-subtitle'))
  doc.metadata.authors = node2Obj(node.querySelector('#metadata-authors'))
  doc.metadata.abstract = node2Obj(node.querySelector('#metadata-abstract'))
  doc.metadata.keywords = node2Obj(node.querySelector('#metadata-keywords'))
  */
  doc.contents = node2Obj(node.querySelector('#document-contents'));
  return doc;
};
