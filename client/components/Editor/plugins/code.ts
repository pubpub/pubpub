import { undo, redo } from 'prosemirror-history';
import {
	codeMirrorBlockPlugin,
	defaultSettings,
	languageLoaders,
	legacyLanguageLoaders,
} from 'prosemirror-codemirror-block';

export default (schema) => {
	if (schema.nodes.code_block) {
		return [
			codeMirrorBlockPlugin({
				...defaultSettings,
				languageLoaders: { ...languageLoaders, ...legacyLanguageLoaders },
				undo,
				redo,
			}),
		];
	}
	return [];
};
