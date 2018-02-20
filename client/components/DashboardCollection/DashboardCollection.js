import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import { Button, NonIdealState } from '@blueprintjs/core';
import LayoutHtml from 'components/LayoutHtml/LayoutHtml';
import LayoutText from 'components/LayoutText/LayoutText';

require('./dashboardCollection.scss');

const propTypes = {
	collectionData: PropTypes.object.isRequired,
	onCreatePub: PropTypes.func.isRequired,
	createPubLoading: PropTypes.bool,
	hostname: PropTypes.string.isRequired,
};

const defaultProps = {
	createPubLoading: false,
};

class DashboardCollection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sortMode: 'title',
			isSortReverse: false,
		};
		this.handleCreatePub = this.handleCreatePub.bind(this);
		this.handleSort = this.handleSort.bind(this);
	}


	handleCreatePub() {
		if (this.props.collectionData.id) {
			this.props.onCreatePub(this.props.collectionData.id);
		}
	}

	handleSort(param) {
		this.setState({
			sortMode: param,
			isSortReverse: this.state.sortMode === param && !this.state.isSortReverse,
		});
	}
	render() {
		const collectionData = this.props.collectionData;
		const pubs = collectionData.pubs.map((item)=> {
			let status = 'unpublished';
			if (item.firstPublishedAt) { status = 'published'; }
			if (item.hasOpenSubmission) { status = 'submitted'; }
			return { ...item, status: status };
		}) || [];
		const sections = [
			{ title: 'Title', param: 'title', className: 'title' },
			{ title: '', param: 'edit-button' },
			{ title: 'Status', param: 'status' },
			{ title: 'Last Modified', param: 'updatedAt' },
			{ title: <span className="pt-icon-standard pt-icon-people" />, param: 'collaboratorCount', className: 'tight' },
			{ title: <span className="pt-icon-standard pt-icon-chat" />, param: 'discussionCount', className: 'tight' },
			{ title: <span className="pt-icon-standard pt-icon-manually-entered-data" />, param: 'suggestionCount', className: 'tight' },
		];

		return (
			<div className="dashboard-collection-component">
				<div className="content-buttons">
					<a href={`/dashboard/${collectionData.slug || 'home'}/edit`} className="pt-button">Edit {collectionData.isPage ? 'Page' : 'Collection'}</a>
					{!collectionData.isPage &&
						<Button
							type="button"
							className="pt-button"
							loading={this.props.createPubLoading}
							onClick={this.handleCreatePub}
							text="Create Pub in Collection"
						/>
					}
				</div>

				<h1 className="content-title">{collectionData.title}</h1>

				<div className="status-bar">
					<div className="description">{collectionData.description}</div>
					{!collectionData.isPage &&
						<div className="description">
							Submissions can be made at <a href={`/${collectionData.slug || 'home'}/submit${collectionData.isOpenSubmissions ? '' : `/${collectionData.createPubHash}`}`}>{this.props.hostname}/{collectionData.slug || 'home'}/submit{collectionData.isOpenSubmissions ? '' : `/${collectionData.createPubHash}`}</a>
						</div>
					}
					<div>
						<a href={`/${collectionData.slug}`}>
							<span className="pt-icon-standard pt-icon-link" /> {this.props.hostname}/{collectionData.slug}
						</a>
					</div>
					<div className="status-bar-separator">·</div>
					{collectionData.isPublic
						? <div><span className="pt-icon-standard pt-icon-globe" /> Public</div>
						: <div><span className="pt-icon-standard pt-icon-lock" /> Private</div>
					}
					{!collectionData.isPage &&
						<div>
							<div className="status-bar-separator">·</div>
							{collectionData.isOpenSubmissions
								? <div><span className="pt-icon-standard pt-icon-add-to-artifact" /> Open Submissions</div>
								: <div><span className="pt-icon-standard pt-icon-delete" /> Closed Submissions</div>
							}
						</div>
					}
					{!collectionData.isPage &&
						<div>
							<div className="status-bar-separator">·</div>
							{collectionData.isOpenPublish
								? <div><span className="pt-icon-standard pt-icon-add-to-artifact" /> Open Publishing</div>
								: <div><span className="pt-icon-standard pt-icon-delete" /> Closed Publishing</div>
							}
						</div>
					}
				</div>

				{collectionData.isPage && !!collectionData.layout &&
					<div className="layout">
						{collectionData.layout.map((item)=> {
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

				{!!pubs.length && !collectionData.isPage &&
					<table>
						<thead className="table-header">
							<tr>
								{sections.map((section)=> {
									if (!section.title) {
										return <th key="th-empty" />;
									}
									return (
										<th key={`th-${section.param}`} onClick={()=> { this.handleSort(section.param); }} className={this.state.sortMode === section.param ? `active ${section.className}` : section.className}>
											{section.title}
											<span className="pt-icon-standard pt-icon-double-caret-vertical" />
										</th>
									);
								})}
							</tr>
						</thead>
						<tbody>
							{pubs.sort((foo, bar)=> {
								const key = this.state.sortMode;
								const direction = this.state.isSortReverse ? -1 : 1;
								if (foo[key] > bar[key]) { return 1 * direction; }
								if (foo[key] < bar[key]) { return -1 * direction; }
								return 0;
							}).map((pub)=> {
								return (
									<tr key={`collection-pub-${pub.id}`}>
										<td className="title"><a href={`/pub/${pub.slug}`}>{pub.title}</a></td>
										<td><a href={`/pub/${pub.slug}/collaborate`} className="pt-button pt-icon-edit pt-minimal" /></td>
										<td className={`status ${pub.status}`}>
											{pub.status}
										</td>
										<td className="date"><TimeAgo date={pub.updatedAt} title="Last Modified Date" /></td>
										<td className="tight">{pub.collaboratorCount}</td>
										<td className="tight">{pub.discussionCount}</td>
										<td className="tight">{pub.suggestionCount}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				}

				{!collectionData.isPage && !pubs.length &&
					<NonIdealState
						title="Empty Collection"
						description="Add Pubs to this collection from a Pub's Collaborate page."
						visual="pt-icon-duplicate"
					/>
				}
			</div>
		);
	}
}

DashboardCollection.defaultProps = defaultProps;
DashboardCollection.propTypes = propTypes;
export default DashboardCollection;
