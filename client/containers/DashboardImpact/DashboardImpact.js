import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { usePageContext } from 'utils/hooks';
import { apiFetch } from 'utils';

require('./dashboardImpact.scss');

const propTypes = {
	impactData: PropTypes.object.isRequired,
};

const DashboardImpact = (props) => {
	const [metabaseUrl, setMetabaseUrl] = useState(null);
	const { impactData } = props;
	const { scopeData } = usePageContext();
	const {
		elements: { activeTargetType },
		activePermissions: { canView },
	} = scopeData;

	let apiUrl = `/api/metabase/`;
	if (activeTargetType === 'community') {
		apiUrl += `community/${scopeData.elements.activeIds.communityId}`;
	}
	if (activeTargetType === 'pub') {
		apiUrl += `pub/${scopeData.elements.activeIds.pubId}`;
	}

	useEffect(() => {
		apiFetch(apiUrl, {
			method: 'GET',
		})
			.then(({ token }) => {
				setMetabaseUrl(
					`https://metabase.pubpub.org/embed/dashboard/${token}#bordered=false&titled=false`,
				);
			})
			.catch((err) => {
				console.error(err);
			});
	});

	return (
		<div className="dashboard-impact-container">
			<h2 className="dashboard-content-header">Impact</h2>
			{canView ? (
				<iframe className="metabase" src={metabaseUrl} title="Analytics" frameBorder="0" />
			) : (
				<p>Ask your community administrator for access to impact data.</p>
			)}
		</div>
	);
};

DashboardImpact.propTypes = propTypes;
export default DashboardImpact;
