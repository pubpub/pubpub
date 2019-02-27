import { generateHash } from 'utilities';

export const hasPermanentHighlight = (pubData, editorChangeObject, queryObject) => {
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

export const getPubHighlightContent = (pubData, locationData, editorChangeObject, from, to) => {
	const primaryEditorState = editorChangeObject.view.state;
	if (
		!primaryEditorState ||
		primaryEditorState.doc.nodeSize < from ||
		primaryEditorState.doc.nodeSize < to
	) {
		return {};
	}
	const exact = primaryEditorState.doc.textBetween(from, to);
	const prefix = primaryEditorState.doc.textBetween(Math.max(0, from - 10), Math.max(0, from));
	const suffix = primaryEditorState.doc.textBetween(
		Math.min(primaryEditorState.doc.nodeSize - 2, to),
		Math.min(primaryEditorState.doc.nodeSize - 2, to + 10),
	);
	const hasSections = pubData.isDraft
		? pubData.sectionsData.length > 1
		: Array.isArray(pubData.versions[0].content);
	const sectionId = hasSections ? locationData.params.sectionId || '' : undefined;
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
	locationData,
	activeDiscussionChannel,
	editorChangeObject,
) => {
	const queryObject = locationData.query;
	const { activeVersion, discussions = [] } = pubData;
	const hasSections = pubData.isDraft
		? pubData.sectionsData.length > 1
		: activeVersion && Array.isArray(activeVersion.content);
	const sectionId = locationData.params.sectionId || '';
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
	if (hasPermanentHighlight(pubData, editorChangeObject, queryObject)) {
		highlights.push({
			...getPubHighlightContent(
				pubData,
				locationData,
				editorChangeObject,
				Number(queryObject.from),
				Number(queryObject.to),
			),
			permanent: true,
		});
	}
	return highlights;
};
