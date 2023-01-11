import { Schema } from 'prosemirror-model';
import { Plugin, PluginKey, Transaction } from 'prosemirror-state';

import { PluginsOptions } from '../..';

import { SuggestedEditsPluginState } from './types';
import { getInitialPluginState } from './state';
import { appendTransaction } from './appendTransaction';

export const suggestedEditsPluginKey = new PluginKey('suggested-edits');

export default (schema: Schema, options: PluginsOptions) => {
	const { collaborativeOptions } = options;
	return new Plugin<SuggestedEditsPluginState>({
		key: suggestedEditsPluginKey,
		appendTransaction,
		state: {
			init: () => getInitialPluginState(schema, collaborativeOptions?.clientData?.id!),
			apply: (tr: Transaction, pluginState: SuggestedEditsPluginState) => {
				const meta = tr.getMeta(suggestedEditsPluginKey);
				if (meta?.updatedState) {
					return {
						...pluginState,
						...meta.updatedState,
					};
				}
				return pluginState;
			},
		},
	});
};
