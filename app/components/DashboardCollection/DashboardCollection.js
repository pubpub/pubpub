import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
						<tr className={'table-header'}>
							<th className={this.props.sortMode === 'title' ? 'active': ''}>
								Title
								<span className={'pt-icon-standard pt-icon-double-caret-vertical'} />
							</th>
							<th>
								Status
								<span className={'pt-icon-standard pt-icon-double-caret-vertical'} />
							</th>
							<th>
								Last Modified
								<span className={'pt-icon-standard pt-icon-double-caret-vertical'} />
							</th>
							<th>
								Activity
								<span className={'pt-icon-standard pt-icon-double-caret-vertical'} />
							</th>
							<th></th>
						</tr>
						{pubs.map((pub)=> {
							return (
								<tr key={`collection-pub-${pub.id}`}>
									<td className={'title'}>{pub.title}</td>
									<td className={`status ${pub.status}`}>{pub.status}</td>
									<td>3 days ago</td>
									<td>activity</td>
									<td className={'min-width'}><button type={'button'} className={'pt-button pt-icon-edit pt-minimal'} /></td>

								</tr>
							);
						})}
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
