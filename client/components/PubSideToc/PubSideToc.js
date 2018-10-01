import React from 'react';
import PropTypes from 'prop-types';
import { getJSON } from '@pubpub/editor';

require('./pubSideToc.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	setOptionsMode: PropTypes.func.isRequired,
	// editorRefNode: PropTypes.object,
	activeContent: PropTypes.object,
	editorChangeObject: PropTypes.object.isRequired,
};

const defaultProps = {
	// editorRefNode: undefined,
	activeContent: undefined,
};

const PubSideToc = function(props) {
	/* activeContent will be defined on saved versions */
	/* editorRefNode will be defined and used on working drafts */
	if (!props.activeContent && !props.editorChangeObject.view) { return null; }

	const queryObject = props.locationData.query;
	const content = props.pubData.activeVersion && props.pubData.activeVersion.content;
	const activeSectionId = props.locationData.params.sectionId || '';
	const sectionsData = props.pubData.isDraft
		? props.pubData.sectionsData
		: content;

	const hasSections = Array.isArray(sectionsData) && sectionsData.length > 1;

	const headingsContent = props.activeContent || getJSON(props.editorChangeObject.view);

	const headings = headingsContent.content.filter((item)=> {
		return item.type === 'heading' && item.attrs.level < 3;
	}).map((item, index)=> {
		const textContent = item.content && item.content.filter((node)=> {
			/* Filter to remove inline non-text nodes: e.g. equations */
			return node.type === 'text';
		}).reduce((prev, curr)=> {
			return `${prev}${curr.text}`;
		}, '');
		return {
			title: textContent,
			level: item.attrs.level,
			href: textContent && textContent.trim().toLowerCase().replace(/ /gi, '-').replace(/[^a-zA-Z0-9-]/gi, ''),
			index: index,
		};
	}).filter((item)=> {
		/* Filter out empty headers */
		return item.title;
	}).map((item)=> {
		const offset = hasSections ? 0 : -1;
		return (
			<a
				href={`#${item.href}`}
				className={`subsection-${item.level + offset}`}
				key={`subsection-${item.index}`}
				onClick={(evt)=> {
					/* In the working draft, don't use anchor tags for nav since we have */
					/* a fixed header bar. Plus, the URL with an anchor tag will behave */
					/* unexpectedly on reload given the async loading of doc. Instead, */
					/* manually scroll to the position and offset by fixed header height. */
					if (props.pubData.isDraft) {
						evt.preventDefault();
						document.getElementById(item.href).scrollIntoView();
						const currentTop = document.body.scrollTop || document.documentElement.scrollTop;
						document.body.scrollTop = document.documentElement.scrollTop = currentTop - 75;
					}
				}}
			>
				{item.title}
			</a>
		);
	});

	/* In case we want to calculate this without converting to JSON when in draft:
	Converting to JSON seems to take about 1ms for long documents.

	if (props.pubData.isDraft) {
		headings = props.editorRefNode && props.editorRefNode.view.state.doc.content.content.filter((item)=> {
			return item.type.name === 'heading' && item.attrs.level < 3;
		}).map((item, index)=> {
			return {
				title: item.textContent,
				level: item.attrs.level,
				href: item.textContent.trim().toLowerCase().replace(/ /gi, '-').replace(/[^a-zA-Z0-9-]/gi, ''),
				index: index,
			};
		});
	}
	*/
	if (!hasSections && !headings.length) { return null; }
	return (
		<div className="pub-side-toc-component">
			{(props.pubData.isDraft || hasSections) &&
				<a
					href={`/pub/${props.pubData.slug}/sections`}
					className="header-title"
					onClick={(evt)=> {
						evt.preventDefault();
						props.setOptionsMode('sections');
					}}
				>
					Table of Contents
				</a>
			}
			{!props.pubData.isDraft && !hasSections &&
				<span className="header-title">
					Table of Contents
				</span>
			}
			<div className="toc">
				{hasSections && sectionsData.map((section, index)=> {
					const split = section.title.split('/');
					const prefix = split.length > 1
						? split[0].trim()
						: undefined;
					const title = split.length > 1
						? split[1].trim()
						: split[0].trim();
					return (
						<div key={section.id}>
							{prefix &&
								<span className={`section-header ${index === 0 ? 'first' : ''}`}>{prefix}</span>
							}
							<a
								href={`/pub/${props.pubData.slug}/${props.pubData.isDraft ? 'draft/' : ''}${index === 0 ? '' : 'content/'}${section.id}${queryObject.version ? `?version=${queryObject.version}` : ''}`}
								className={activeSectionId === section.id ? 'active' : ''}
							>
								{title}
							</a>
							{activeSectionId === section.id && headings}
						</div>
					);
				})}
				{!hasSections && headings}
			</div>
		</div>
	);
};

PubSideToc.propTypes = propTypes;
PubSideToc.defaultProps = defaultProps;
export default PubSideToc;
