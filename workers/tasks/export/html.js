import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import sass from 'node-sass';
import { renderStatic, buildSchema } from '@pubpub/editor';

import { SimpleNotesList } from 'components';

const nonExportableNodeTypes = ['discussion'];
const katexCdnPrefix = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/';
const citationPrefix = 'cite';
const footnotePrefix = 'fn';

const createCss = () => {
	const nodeModulesPath = path.join(process.env.PWD, 'node_modules');
	const clientPath = path.join(process.env.PWD, 'client');
	return (
		sass
			.renderSync({
				file: path.join(__dirname, 'styles', 'print-document.scss'),
				includePaths: [nodeModulesPath, clientPath],
				importer: (url) => {
					if (url.startsWith('~')) {
						return { file: path.join(nodeModulesPath, url.slice(1)) };
					}
					return null;
				},
			})
			.css.toString()
			// Find all things like url(fonts/KaTeX_whatever) and replace them with a version that
			// is loaded from an external CDN.
			.replace(
				/url\((fonts\/KaTeX_(?:[A-z0-9\-_]*?).(?:[A-z0-9]+))\)/g,
				(_, fontPath) => `url(${katexCdnPrefix + fontPath})`
			)
	);
};

const staticCss = createCss();

const filterNonExportableNodes = (nodes) =>
	nodes.filter((n) => !nonExportableNodeTypes.includes(n.type));

const addAttrsToNodes = (newAttrs, matchNodeTypes, nodes) =>
	nodes.map((node) => {
		if (matchNodeTypes.includes(node.type)) {
			return {
				...node,
				attrs: {
					...node.attrs,
					...(typeof newAttrs === 'function' ? newAttrs(node) || {} : newAttrs),
				},
			};
		}
		if (node.content) {
			return {
				...node,
				content: addAttrsToNodes(newAttrs, matchNodeTypes, node.content),
			};
		}
		return node;
	});

const renderEquationsAsScripts = (nodes) =>
	addAttrsToNodes({ renderForPandoc: true }, ['equation', 'block_equation'], nodes);

const addHrefsToNotes = (nodes) =>
	addAttrsToNodes(
		(node) => {
			const { count } = node.attrs;
			if (node.type === 'citation') {
				return {
					href: `#${citationPrefix}-${count}`,
					id: `${citationPrefix}-${count}-return`,
				};
			}
			if (node.type === 'footnote') {
				return {
					href: `#${footnotePrefix}-${count}`,
					id: `${footnotePrefix}-${count}-return`,
				};
			}
			return {};
		},
		['citation', 'footnote'],
		nodes,
	);

export const createStaticHtml = async (
	{ prosemirrorDoc, pubMetadata, citations, footnotes },
	targetPandoc,
) => {
	const { title, doi, publishedDateString, updatedDateString } = pubMetadata;
	const showUpdatedDate = updatedDateString && updatedDateString !== publishedDateString;

	const renderableNodes = [
		filterNonExportableNodes,
		targetPandoc && renderEquationsAsScripts,
		!targetPandoc && addHrefsToNotes,
	]
		.filter((x) => x)
		.reduce((nodes, fn) => fn(nodes), prosemirrorDoc.content);

	const docContent = renderStatic(buildSchema(), renderableNodes, {});

	return ReactDOMServer.renderToStaticMarkup(
		<html lang="en">
			<head>
				<title>{title}</title>
				{!targetPandoc && (
					<style type="text/css" dangerouslySetInnerHTML={{ __html: staticCss }} />
				)}
			</head>
			<body>
				<div className="pub-body-component">
					<div className="editor Prosemirror">
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
						{docContent}
						<div className="pub-notes">
							<SimpleNotesList
								title="Footnotes"
								notes={footnotes}
								prefix={footnotePrefix}
							/>
							<SimpleNotesList
								title="Citations"
								notes={citations}
								prefix={citationPrefix}
							/>
						</div>
					</div>
				</div>
			</body>
		</html>,
	);
};
