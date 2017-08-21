import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

require('./dashboardCollection.scss');

const propTypes = {
	collectionData: PropTypes.object.isRequired,
	sortMode: PropTypes.string,
};

const defaultProps = {
	sortMode: 'title',
};


class DashboardCollection extends Component {	

	render() {
		const data = this.props.collectionData;

		const pubs = data.pubs || [];
		const sections = ['title', 'status', 'last modified', 'activity']
		return (
			<div className={'dashboard-collection'}>
				<div className={'content-buttons'}>
					<button type={'button'} className={'pt-button'}>Edit Collection</button>
					<button type={'button'} className={'pt-button'}>Create Pub in Collection</button>
				</div>

				<h1 className={'content-title'}>{data.title}</h1>
				
				<div className={'status-bar'}>
					<div>{window.location.origin}/{data.slug}</div>
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
					<div className={'description'}>{data.description}</div>
				</div>

				
				{pubs.length &&
					<table>
						<thead className={'table-header'}>
							<tr>
								{sections.map((section)=> {
									return (
										<th key={`th-${section}`} className={this.props.sortMode === section ? 'active': ''}>
											{section}
											<span className={'pt-icon-standard pt-icon-double-caret-vertical'} />
										</th>
									);
								})}
								<th className={'not-sortable'}/>
							</tr>
						</thead>
						<tbody>
							{pubs.map((pub)=> {
								return (
									<tr key={`collection-pub-${pub.id}`}>
										<td className={'title'}><Link to={`/pub/${pub.slug}`}>{pub.title}</Link></td>
										<td className={`status min-width ${pub.status}`}>{pub.status}</td>
										<td className={'date min-width'}>3 days ago</td>
										<td className={'activity'}>
											{pub.numContributors} <span className={'pt-icon-standard pt-icon-people'}/>
											{pub.numDiscussions} <span className={'pt-icon-standard pt-icon-chat'}/>
											{pub.numSuggestions} <span className={'pt-icon-standard pt-icon-manually-entered-data'}/>
										</td>
										<td className={'min-width'}><Link to={`/pub/${pub.slug}/edit`} className={'pt-button pt-icon-edit pt-minimal'} /></td>

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
	}
}

DashboardCollection.defaultProps = defaultProps;
DashboardCollection.propTypes = propTypes;
export default DashboardCollection;
