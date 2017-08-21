import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

require('./dashboardCollection.scss');

const propTypes = {
	collectionData: PropTypes.object.isRequired,
	sortMode: PropTypes.string,
	isSortReverse: PropTypes.bool,
	isEditMode: PropTypes.bool,
};

const defaultProps = {
	sortMode: 'title',
	isSortReverse: false,
	isEditMode: false,
};

const DashboardCollection = function(props) {
	const data = props.collectionData;

	const pubs = data.pubs || [];
	const sections = [
		{
			title: 'Title',
			param: 'title',
			className: 'title',
		},
		{
			title: '',
			param: 'edit-button',
		},
		{
			title: 'Status',
			param: 'status'
		},
		{
			title: 'Last Modified',
			param: 'modified'
		},
		{
			title: <span className={'pt-icon-standard pt-icon-people'} />,
			param: 'collaborators',
			className: 'tight',
		},
		{
			title: <span className={'pt-icon-standard pt-icon-chat'} />,
			param: 'discussions',
			className: 'tight',
		},
		{
			title: <span className={'pt-icon-standard pt-icon-manually-entered-data'} />,
			param: 'suggestions',
			className: 'tight',
		},
	];
	return (
		<div className={'dashboard-collection'}>
			<div className={'content-buttons'}>
				<button type={'button'} className={'pt-button'}>Edit Collection</button>
				<button type={'button'} className={'pt-button'}>Create Pub in Collection</button>
			</div>

			<h1 className={'content-title'}>{data.title}</h1>
			
			<div className={'status-bar'}>
				<div className={'description'}>{data.description}</div>

				<div>
					<span className={'pt-icon-standard pt-icon-link'} /> {window.location.origin}/{data.slug}
				</div>
				<div className={'status-bar-separator'}>·</div>
				{data.isPublic
					? <div><span className={'pt-icon-standard pt-icon-globe'} /> Public</div>
					: <div><span className={'pt-icon-standard pt-icon-lock'} /> Private</div>
				}
				<div className={'status-bar-separator'}>·</div>
				{data.isOpenSubmissions
					? <div><span className={'pt-icon-standard pt-icon-add-to-artifact'} /> Open Submissions</div>
					: <div><span className={'pt-icon-standard pt-icon-delete'} /> Closed Submissions</div>
				}
				
			</div>

			
			{pubs.length &&
				<table>
					<thead className={'table-header'}>
						<tr>
							{sections.map((section)=> {
								if (!section.title) {
									return <th key={'th-empty'} />;
								}
								return (
									<th key={`th-${section.param}`} className={props.sortMode === section.param ? `active ${section.className}`: section.className}>
										<Link to={`/dashboard/${data.slug}?sort=${section.param}${props.sortMode === section.param && !props.isSortReverse ? '&direction=reverse' : ''}`} replace>
											{section.title}
											<span className={'pt-icon-standard pt-icon-double-caret-vertical'} />
										</Link>
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody>
						{pubs.sort((foo, bar)=> {
							let key = props.sortMode;
							if (props.sortMode === 'modified') { key = 'lastModified'; }
							if (props.sortMode === 'collaborators') { key = 'numCollaborators'; }
							if (props.sortMode === 'discussions') { key = 'numDiscussions'; }
							if (props.sortMode === 'suggestions') { key = 'numSuggestions'; }

							const direction = props.isSortReverse ? -1 : 1;
							if (foo[key] > bar[key]) { return 1 * direction; }
							if (foo[key] < bar[key]) { return -1 * direction; }
							return 0

						}).map((pub)=> {
							return (
								<tr key={`collection-pub-${pub.id}`}>
									<td className={'title'}><Link to={`/pub/${pub.slug}`}>{pub.title}</Link></td>
									<td><Link to={`/pub/${pub.slug}/edit`} className={'pt-button pt-icon-edit pt-minimal'} /></td>
									<td className={`status ${pub.status}`}>{pub.status}</td>
									<td className={'date'}>3 days ago</td>
									<td className={'tight'}>{pub.numCollaborators}</td>
									<td className={'tight'}>{pub.numDiscussions}</td>
									<td className={'tight'}>{pub.numSuggestions}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			} 
			
			{/*<div className="pt-button-group">
				<button type="button" className="pt-button pt-icon-globe pt-active">Public</button>
				<button type="button" className="pt-button pt-icon-lock">Private</button>
			</div>

			<div className="pt-button-group">
				<button type="button" className="pt-button pt-icon-add-to-artifact pt-active">Open</button>
				<button type="button" className="pt-button pt-icon-delete">Closed</button>
			</div>*/}
		</div>
	);
};


DashboardCollection.defaultProps = defaultProps;
DashboardCollection.propTypes = propTypes;
export default DashboardCollection;
