import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { splitBlock } from 'prosemirror-commands';

import {
	CommandStateBuilder,
	SchemaType,
	CreateToggleOptions,
	ToggleOptions,
	CommandSpec,
	Dispatch,
} from './types';

export const createCommandSpec = (builder: CommandStateBuilder): CommandSpec => {
	return (view: EditorView) => (state: EditorState) => builder(view.dispatch, state);
};

export const createTypeToggle = <S extends SchemaType>(options: CreateToggleOptions<S>) => {
	const { getTypeFromSchema, withAttrs, commandFn, isActiveFn } = options;
	return createCommandSpec((dispatch, state) => {
		const type = getTypeFromSchema(state.schema);
		const toggleOptions: ToggleOptions<S> = { state, type, withAttrs };
		return {
			run: () => commandFn({ ...toggleOptions, dispatch }),
			canRun: commandFn(toggleOptions),
			isActive: type && isActiveFn(toggleOptions),
		};
	});
};

export const splitBlockPreservingCommands = (attr: string) => {
	return (state: EditorState, dispatch?: Dispatch) => {
		const { $from: previousSelectionFrom } = state.selection;
		return splitBlock(state, (tr) => {
			if (dispatch) {
				const targetNodePosition = tr.selection.$from.before();
				const targetNode = tr.doc.nodeAt(targetNodePosition);
				const sourceNode = previousSelectionFrom.node();
				if (attr === 'textAlign') {
					const { [attr]: textAlign } = sourceNode.attrs;
					tr.setNodeMarkup(targetNodePosition, undefined, {
						...targetNode?.attrs,
						[attr]: textAlign,
					});
				}
				if (attr === 'rtl') {
					const { [attr]: rtl } = sourceNode.attrs;
					tr.setNodeMarkup(targetNodePosition, undefined, {
						...targetNode?.attrs,
						[attr]: rtl,
					});
				}
				dispatch(tr);
			}
		});
	};
};
