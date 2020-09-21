import { suggest, Suggester } from 'prosemirror-suggest';
import { getReferenceableNodes, buildLabel, NodeReference } from '../utils/references';

export default (schema, props) => {
	const { blockNames } = props;

	let selectedIndex = 0;
	let showDropdown = false;
	let references: NodeReference[] = [];

	const plugin: Suggester = {
		noDecorations: true,
		char: '@',
		name: 'reference-suggestion',
		appendText: '',
		keyBindings: {
			ArrowUp: () => {
				if (showDropdown) {
					selectedIndex = (selectedIndex - 1 + length) % length;
					return true;
				}
			},
			ArrowDown: (...args) => {
				console.log(args);
				if (showDropdown) {
					selectedIndex = (selectedIndex + 1) % length;
					return true;
				}
			},
			Enter: ({ command }) => {
				if (showDropdown) {
					command(references[selectedIndex]);
				}
			},
			Esc: () => {
				showDropdown = false;
			},
		},
		onChange: (params) => {
			selectedIndex = 0;
			showDropdown = true;
			references = getReferenceableNodes(params.view.state).filter((target) => {
				const label = buildLabel(target.node, blockNames[target.node.type.name]);

				if (!label) {
					return false;
				}

				return label.toLowerCase().indexOf(params.queryText.partial.toLowerCase()) > -1;
			});
		},
		onExit: () => {
			showDropdown = false;
			references = [];
			selectedIndex = 0;
		},
		createCommand: ({ match, view }) => {
			return (reference: NodeReference) => {
				const tr = view.state.tr;
				const { from, end: to } = match.range;

				// Clear query text.
				tr.deleteRange(from, to);
				view.dispatch(tr);

				// Insert reference node.
				schema.nodes.reference.spec.onInsert(view, {
					targetId: reference.node.attrs.id,
				});
			};
		},
	};

	return suggest(plugin);
};
