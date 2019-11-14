/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
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
const bullet = ' • ';

const createCss = () => {
	const nodeModulesPath = path.join(process.env.PWD, 'node_modules');
	const clientPath = path.join(process.env.PWD, 'client');
	return (
		sass
			.renderSync({
				file: path.join(__dirname, 'styles', 'printDocument.scss'),
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
				(_, fontPath) => `url(${katexCdnPrefix + fontPath})`,
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

const renderFrontMatterForPandoc = ({ updatedDateString, publishedDateString, doi }) => {
	const showUpdatedDate = updatedDateString && updatedDateString !== publishedDateString;
	return (
		<React.Fragment>
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
		</React.Fragment>
	);
};

const renderFrontMatterForHtml = ({
	updatedDateString,
	publishedDateString,
	primaryCollectionTitle,
	doi,
	title,
	communityTitle,
	attributions,
}) => {
	const showUpdatedDate = updatedDateString && updatedDateString !== publishedDateString;
	const affiliations = [...new Set(attributions.map((attr) => attr.affiliation))];
	return (
		<section className="cover">
			<h2>
				<span className="community">{communityTitle}</span>
				{primaryCollectionTitle && (
					<React.Fragment>
						{bullet}
						<span className="collection">{primaryCollectionTitle}</span>
					</React.Fragment>
				)}
			</h2>
			<h1 className="title">{title}</h1>
			<div className="byline">
				<h3>
					{attributions.map((attr, index) => {
						const {
							user: { fullName },
							affiliation,
						} = attr;
						const affiliationNumber =
							affiliation && affiliations.includes(affiliation)
								? 1 + affiliations.indexOf(affiliation)
								: null;
						return (
							<span key={index}>
								{fullName}
								{affiliationNumber && <sup>{affiliationNumber}</sup>}
								{index < attributions.length - 1 && ', '}
							</span>
						);
					})}
				</h3>
				{affiliations.length > 0 && (
					<h5>
						{affiliations.map((aff, index) => (
							<span key={index}>
								{<sup>{index + 1}</sup>}
								{aff}
								{index < affiliations.length - 1 && ', '}
							</span>
						))}
					</h5>
				)}
			</div>
			{publishedDateString && (
				<div>
					<strong>Published on: </strong> {publishedDateString}
				</div>
			)}
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
		</section>
	);
};

export const createStaticHtml = async (
	{ prosemirrorDoc, pubMetadata, citations, footnotes },
	targetPandoc,
) => {
	const { title } = pubMetadata;

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
				{targetPandoc
					? renderFrontMatterForPandoc(pubMetadata)
					: renderFrontMatterForHtml(pubMetadata)}
				<div className="pub-body-component">
					<div className="editor Prosemirror">
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
