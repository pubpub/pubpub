import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// require('./dashboardCollection.scss');

const propTypes = {
	collectionData: PropTypes.object.isRequired,
};

const DashboardCollectionEdit = function(props) {
	const data = props.collectionData;

	const pubs = data.pubs || [];

	return (
		<div className={'dashboard-collection'}>
			<div className={'content-buttons'}>
				<button type={'button'} className={'pt-button'}>Cancel</button>
				<button type={'button'} className={'pt-button pt-intent-primary'}>Save Changes</button>
			</div>

			<div>title</div>
			<div>description</div>
			<div>link</div>
			<div>privacy</div>
			<div>submissions</div>
			<div>Layout</div>
			

			
			
			
			<div className="pt-button-group">
				<button type="button" className="pt-button pt-icon-globe pt-active">Public</button>
				<button type="button" className="pt-button pt-icon-lock">Private</button>
			</div>

			<div className="pt-button-group">
				<button type="button" className="pt-button pt-icon-add-to-artifact pt-active">Open</button>
				<button type="button" className="pt-button pt-icon-delete">Closed</button>
			</div>
		</div>
	);
};


DashboardCollectionEdit.propTypes = propTypes;
export default DashboardCollectionEdit;
