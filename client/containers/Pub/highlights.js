import { generateHash } from 'utilities';

const hasPermanentHighlight = (pubData, editorChangeObject, queryObject) => {
	return pubData.isDraft
		? typeof window !== 'undefined' &&
				editorChangeObject.view &&
				queryObject.from &&
				queryObject.to
		: typeof window !== 'undefined' &&
				editorChangeObject.view &&
				queryObject.from &&
				queryObject.to &&
				queryObject.version;
};

export const getPubHighlightContent = (pubData, editorDoc, query, sectionId) => {
	const { from, to } = query;
	if (!editorDoc || editorDoc.nodeSize < from || editorDoc.nodeSize < to) {
		return {};
	}
	const exact = editorDoc.textBetween(from, to);
	const prefix = editorDoc.textBetween(Math.max(0, from - 10), Math.max(0, from));
	const suffix = editorDoc.textBetween(
		Math.min(editorDoc.nodeSize - 2, to),
		Math.min(editorDoc.nodeSize - 2, to + 10),
	);
	const hasSections = pubData.isDraft
		? pubData.sectionsData.length > 1
		: Array.isArray(pubData.versions[0].content);
	const highlightObject = {
		exact: exact,
		prefix: prefix,
		suffix: suffix,
		from: from,
		to: to,
		version: pubData.isDraft ? undefined : pubData.versions[0].id,
		section: hasSections ? sectionId : undefined,
		id: `h${generateHash(8)}`, // Has to start with letter since it's a classname
	};
	return highlightObject;
};

export const getHighlights = (
	pubData,
	activeDiscussionChannel,
	sectionId,
	queryObject,
	editorChangeObject,
) => {
	const { activeVersion, discussions = [] } = pubData;
	const hasSections = pubData.isDraft
		? pubData.sectionsData.length > 1
		: activeVersion && Array.isArray(activeVersion.content);
	/* Get Highlights from discussions. Filtering for */
	/* only highlights that are active in the current section */
	/* and not archived. */
	const highlights = discussions
		.filter((item) => {
			return !item.isArchived && item.highlights;
		})
		.filter((item) => {
			const activeDiscussionChannelId = activeDiscussionChannel
				? activeDiscussionChannel.id
				: null;
			return activeDiscussionChannelId === item.discussionChannelId;
		})
		.reduce((prev, curr) => {
			const highlightsWithThread = curr.highlights.map((item) => {
				return { ...item, threadNumber: curr.threadNumber };
			});
			return [...prev, ...highlightsWithThread];
		}, [])
		.filter((highlight) => {
			if (!hasSections) {
				return true;
			}
			return sectionId === highlight.section;
		});
	if (hasPermanentHighlight(pubData, queryObject, editorChangeObject)) {
		highlights.push({
			...getHighlightContent(Number(queryObject.from), Number(queryObject.to)),
			permanent: true,
		});
	}
	return highlights;
};
