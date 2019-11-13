import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { renderStatic, buildSchema } from '@pubpub/editor';

import { SimpleNotesList } from 'components';

const nonExportableNodeTypes = ['discussion'];

const filterNonExportableNodes = (nodes) =>
	nodes.filter((n) => !nonExportableNodeTypes.includes(n.type));

const hideEquationChildren = (nodes) =>
	nodes.map((node) => {
		if (node.type === 'equation' || node.type === 'block_equation') {
			return {
				...node,
				attrs: {
					...node.attrs,
					renderForPandoc: true,
				},
			};
		}
		if (node.content) {
			return {
				...node,
				content: hideEquationChildren(node.content),
			};
		}
		return node;
	});

export const createStaticHtml = async ({ prosemirrorDoc, pubMetadata, citations, footnotes }) => {
	const { title, doi, publishedDateString, updatedDateString } = pubMetadata;
	const showUpdatedDate = updatedDateString && updatedDateString !== publishedDateString;
	return ReactDOMServer.renderToStaticMarkup(
		<html lang="en">
			<head>
				<title>{title}</title>
			</head>
			<body>
				{showUpdatedDate && (
					<div>
						<strong>Updated on:</strong> {updatedDateString}
					</div>
				)}
				{doi && (
					<div>
						<strong>DOI:</strong> {doi}
					</div>
				)}
				{renderStatic(
					buildSchema(),
					hideEquationChildren(filterNonExportableNodes(prosemirrorDoc.content)),
					{},
				)}
				<SimpleNotesList title="Footnotes" notes={footnotes} />
				<SimpleNotesList title="Citations" notes={citations} />
			</body>
		</html>,
	);
};
