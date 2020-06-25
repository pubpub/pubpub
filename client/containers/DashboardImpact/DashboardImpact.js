import React, { useState, useEffect } from 'react';
import { usePageContext } from 'utils/hooks';
import { apiFetch } from 'client/utils/apiFetch';
import { Callout } from '@blueprintjs/core';

require('./dashboardImpact.scss');

const propTypes = {};

const DashboardImpact = () => {
	const [metabaseUrl, setMetabaseUrl] = useState(null);
	const { scopeData } = usePageContext();
	const {
		elements: { activeTargetType },
		activePermissions: { canView },
	} = scopeData;
	const displayDataWarning = scopeData.elements.activeTarget.createdAt < '2020-04-29';

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
			{displayDataWarning && (
				<Callout intent="warning">
					Analytics data collected before 4/29 used a different analytics system than data
					collected after 4/29. Users, pageviews, and other metrics will be inconsistent
					between these two periods, and should not be used for direct comparisons.
				</Callout>
			)}
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
