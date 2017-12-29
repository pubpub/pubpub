import React from 'react';
import PropTypes from 'prop-types';
import { Button, NonIdealState } from '@blueprintjs/core';
import LayoutHtml from 'components/LayoutHtml/LayoutHtml';
import LayoutText from 'components/LayoutText/LayoutText';

require('./dashboardCollection.scss');

const propTypes = {
	collectionData: PropTypes.object.isRequired,
	sortMode: PropTypes.string,
	isSortReverse: PropTypes.bool,
	onCreatePub: PropTypes.func.isRequired,
	createPubLoading: PropTypes.bool,
	localUrl: PropTypes.string.required,
};

const defaultProps = {
	sortMode: 'title',
	isSortReverse: false,
	createPubLoading: false,
};

const DashboardCollection = function(props) {
	const data = props.collectionData;
	const pubs = data.pubs || [];
	const sections = [
		{ title: 'Title', param: 'title', className: 'title' },
		{ title: '', param: 'edit-button' },
		{ title: 'Status', param: 'status' },
		{ title: 'Last Modified', param: 'modified' },
		{ title: <span className="pt-icon-standard pt-icon-people" />, param: 'collaborators', className: 'tight' },
		{ title: <span className="pt-icon-standard pt-icon-chat" />, param: 'discussions', className: 'tight' },
		{ title: <span className="pt-icon-standard pt-icon-manually-entered-data" />, param: 'suggestions', className: 'tight' },
	];

	const handleCreatePub = ()=> {
		if (props.collectionData.id) {
			props.onCreatePub(props.collectionData.id);
		}
	};

	return (
		<div className="dashboard-collection-component">
			<div className="content-buttons">
				<a href={`/dashboard/${data.slug || 'home'}/edit`} className="pt-button">Edit {data.isPage ? 'Page' : 'Collection'}`</a>
				{!data.isPage &&
					<Button
						type="button"
						className="pt-button"
						loading={props.createPubLoading}
						onClick={handleCreatePub}
						text="Create Pub in Collection"
					/>
				}
			</div>

			<h1 className="content-title">{data.title}</h1>

			{/*
			<div>
				<a href="/">Create Pub Page</a>
				<span> · </span>
				<a href="/">Customize Create Pub Page</a>
				<span> · </span>
				<a href="/">Customize Layout</a>
			</div>
			*/}
			<div className="status-bar">
				<div className="description">{data.description}</div>
				{!data.isPage &&
					<div className="description">
						Submissions can be made at <a href={`/${data.slug || 'home'}/submit${data.isOpenSubmissions ? '' : `/${data.createPubHash}`}`}>{props.localUrl}/{data.slug || 'home'}/submit{data.isOpenSubmissions ? '' : `/${data.createPubHash}`}</a>
					</div>
				}
				<div>
					<a href={`/${data.slug}`}>
						<span className="pt-icon-standard pt-icon-link" /> {props.localUrl}/{data.slug}
					</a>
				</div>
				<div className="status-bar-separator">·</div>
				{data.isPublic
					? <div><span className="pt-icon-standard pt-icon-globe" /> Public</div>
					: <div><span className="pt-icon-standard pt-icon-lock" /> Private</div>
				}
				{!data.isPage &&
					<div>
						<div className="status-bar-separator">·</div>
						{data.isOpenSubmissions
							? <div><span className="pt-icon-standard pt-icon-add-to-artifact" /> Open Submissions</div>
							: <div><span className="pt-icon-standard pt-icon-delete" /> Closed Submissions</div>
						}
					</div>
				}
			</div>

			{data.isPage && !!data.layout &&
				<div className="layout">
					{data.layout.map((item)=> {
						if (item.type === 'text') {
							return (
								<div key={`block-${item.id}`} className="component-wrapper">
									<LayoutText
										key={`item-${item.id}`}
										content={item.content}
									/>
								</div>
							);
						}
						if (item.type === 'html') {
							return (
								<div key={`block-${item.id}`} className="component-wrapper">
									<LayoutHtml
										key={`item-${item.id}`}
										content={item.content}
									/>
								</div>
							);
						}
						return null;
					})}
				</div>
			}

			{!!pubs.length && !data.isPage &&
				<table>
					<thead className="table-header">
						<tr>
							{sections.map((section)=> {
								if (!section.title) {
									return <th key="th-empty" />;
								}
								return (
									<th key={`th-${section.param}`} className={props.sortMode === section.param ? `active ${section.className}` : section.className}>
										<a href={`/dashboard/${data.slug}?sort=${section.param}${props.sortMode === section.param && !props.isSortReverse ? '&direction=reverse' : ''}`} replace>
											{section.title}
											<span className="pt-icon-standard pt-icon-double-caret-vertical" />
										</a>
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody>
						{pubs.sort((foo, bar)=> {
							let key = props.sortMode;
							if (props.sortMode === 'modified') { key = 'lastModified'; }
							if (props.sortMode === 'collaborators') { key = 'collaboratorCount'; }
							if (props.sortMode === 'discussions') { key = 'discussionCount'; }
							if (props.sortMode === 'suggestions') { key = 'suggestionCount'; }

							const direction = props.isSortReverse ? -1 : 1;
							if (foo[key] > bar[key]) { return 1 * direction; }
							if (foo[key] < bar[key]) { return -1 * direction; }
							return 0;
						}).map((pub)=> {
							let status = 'unpublished';
							if (!!pub.firstPublishedAt) { status = 'published'; }
							if (pub.hasOpenSubmission) { status = 'submitted'; }
							return (
								<tr key={`collection-pub-${pub.id}`}>
									<td className="title"><a href={`/pub/${pub.slug}`}>{pub.title}</a></td>
									<td><a href={`/pub/${pub.slug}/collaborate`} className="pt-button pt-icon-edit pt-minimal" /></td>
									<td className={`status ${status}`}>
										{status}
									</td>
									<td className="date">3 days ago</td>
									<td className="tight">{pub.collaboratorCount}</td>
									<td className="tight">{pub.discussionCount}</td>
									<td className="tight">{pub.suggestionCount}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			}

			{!data.isPage && !pubs.length &&
				<NonIdealState
					title="Empty Collection"
					description="Add Pubs to this collection from a Pub\'s Collaborate page."
					visual="pt-icon-duplicate"
				/>
			}
		</div>
	);
};


DashboardCollection.defaultProps = defaultProps;
DashboardCollection.propTypes = propTypes;
export default DashboardCollection;
