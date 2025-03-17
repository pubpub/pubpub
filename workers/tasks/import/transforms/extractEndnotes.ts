import { JSONPath } from 'jsonpath-plus';

import { walkAndReplace } from './util';

const getEndnoteDivsQuery = '$..content[?(@.type=="Div" && @.attr.properties.role=="doc-endnote")]';
const getLinksQuery = '$..content[?(@.type=="Link")]';

const matchAndReplaceToRemoveLinkback = (linkback) => {
	return {
		matcher: ({ node }) => node === linkback,
		replacer: () => null,
	};
};

const matchAndReplaceForNotes = (notes) => {
	const matcher = ({ node }) => {
		if (node.type === 'Link') {
			const { url } = node.target;
			return notes.find((someNote) => '#' + someNote.id === url);
		}
		return false;
	};
	const replacer = ({ match }) => match.noteNode;
	return { matcher, replacer };
};

const matchAndReplaceToRemoveDivs = (divs) => {
	return {
		matcher: ({ node }) => divs.includes(node),
		replacer: () => null,
	};
};

const maybeRemoveStrayPeriod = (div) => {
	const [para] = div.content;
	if (para.type === 'Para') {
		const [first, second] = para.content;
		const hasPeriod = first && first.type === 'Str' && first.content === '.';
		const hasSpace = second && second.type === 'Space';
		if (hasPeriod && hasSpace) {
			// Doing this immutably would be preferred, but I'm getting a ReferenceError saying
			// that 'defineProperty is not defined' when I try to use an object spread here, so this
			// is good enough for some experimental code.
			para.content = para.content.slice(2);
		}
	}
	return div;
};

export const extractEndnotesTransformer = (ast) => {
	const endnoteDivs = JSONPath({ json: ast, path: getEndnoteDivsQuery });
	const notes = endnoteDivs
		.map((divNode) => {
			const linkback = JSONPath({ json: divNode, path: getLinksQuery })
				.query(divNode, getLinksQuery)
				.find((link) => link.attr.classes.includes('ennum'));
			if (linkback) {
				return {
					id: linkback.attr.identifier,
					noteNode: {
						type: 'Note',
						content: maybeRemoveStrayPeriod(
							walkAndReplace(divNode, [matchAndReplaceToRemoveLinkback(linkback)]),
						).content,
					},
				};
			}
			return null;
		})
		.filter((x) => x);
	return walkAndReplace(ast, [
		matchAndReplaceForNotes(notes),
		matchAndReplaceToRemoveDivs(endnoteDivs),
	]);
};
