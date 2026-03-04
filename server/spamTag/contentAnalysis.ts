import type { DocJson } from 'types';

const URL_PATTERN = /https?:\/\/[^\s<>"']+|www\.[^\s<>"']+/gi;

type DocNode = {
	type?: string;
	marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
	content?: DocNode[];
	text?: string;
};

export const extractLinksFromDocJson = (doc: DocJson | null | undefined): string[] => {
	if (!doc) return [];
	const links: string[] = [];
	walkDocNodes(doc, links);
	return [...new Set(links)];
};

const walkDocNodes = (node: DocNode, links: string[]): void => {
	if (node.marks) {
		for (const mark of node.marks) {
			if (mark.type === 'link' && typeof mark.attrs?.href === 'string' && mark.attrs.href) {
				links.push(mark.attrs.href);
			}
		}
	}
	if (node.content) {
		for (const child of node.content) {
			walkDocNodes(child, links);
		}
	}
};

export const extractLinksFromText = (text: string | null | undefined): string[] => {
	if (!text) return [];
	const matches = text.match(URL_PATTERN);
	return matches ? [...new Set(matches)] : [];
};

export const containsLink = (
	doc: DocJson | null | undefined,
	text: string | null | undefined,
): boolean => {
	return extractLinksFromDocJson(doc).length > 0 || extractLinksFromText(text).length > 0;
};

// these are template phrases that show up in spam comments that try to look like genuine engagement.
// only meaningful as a spam signal when the comment also contains a link.
const commentSpamTemplates = [
	'this blog post was very helpful',
	'this article was very helpful',
	'this post was very helpful',
	'i found the analysis',
	'i found this article',
	'top-tier and highly relevant',
	'maintains such a high level of professionalism',
	'delivering actionable data',
	'delivering actionable insights',
	'very informative article',
	'very informative post',
	'very informative blog',
	'great article',
	'great blog post',
	'really appreciate this content',
	'this is really informative',
	'this is really helpful',
	'thanks for sharing this',
	'amazing content',
	'wonderful article',
	'excellent article',
	'i really enjoyed reading this',
	'keep up the good work',
	'very well written',
	'this is exactly what i was looking for',
];

export const matchesCommentSpamTemplate = (text: string | null | undefined): string[] => {
	if (!text) return [];
	const lower = text.toLowerCase();
	return commentSpamTemplates.filter((template) => lower.includes(template));
};

export const stripLinksFromDocJson = (doc: DocJson): DocJson => {
	return walkAndStripLinks(doc) as DocJson;
};

const walkAndStripLinks = (node: DocNode): DocNode => {
	const result = { ...node };
	if (result.marks) {
		result.marks = result.marks.filter((mark) => mark.type !== 'link');
		if (result.marks.length === 0) {
			delete result.marks;
		}
	}
	if (result.content) {
		result.content = result.content.map(walkAndStripLinks);
	}
	return result;
};
