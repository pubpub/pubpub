import { Schema } from 'prosemirror-model';
import { Plugin, PluginKey, Transaction } from 'prosemirror-state';

import { PluginsOptions } from '../..';
import { SuggestedEditsPluginState } from './types';
import { appendTransactionForSuggestedEdits } from './transactions';

export const suggestedEditsPluginKey = new PluginKey('suggested-edits');

export default () => {
	return new Plugin<SuggestedEditsPluginState>({
		key: suggestedEditsPluginKey,
		appendTransaction: appendTransactionForSuggestedEdits,
		state: {
			init: () => {
				return { isEnabled: false };
			},
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
