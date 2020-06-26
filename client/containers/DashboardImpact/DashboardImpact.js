import React, { useState, useEffect } from 'react';
import { usePageContext } from 'utils/hooks';
import { apiFetch } from 'client/utils/apiFetch';
import { Callout } from '@blueprintjs/core';

require('./dashboardImpact.scss');

const propTypes = {};

const DashboardImpact = () => {
	const [metabaseUrl, setMetabaseUrl] = useState(null);
	const [metabaseBenchmarkUrl, setMetabaseBenchmarkUrl] = useState(null);

	const { scopeData } = usePageContext();
	const {
		elements: { activeTargetType },
		activePermissions: { canView },
	} = scopeData;
	const displayDataWarning = scopeData.elements.activeTarget.createdAt < '2020-04-29';
	const apiPathBase = `/api/metabase/`;
	let activeId;
	let dashApiPath;
	let benchmarkApiPath;

	if (activeTargetType === 'community') {
		activeId = scopeData.elements.activeIds.communityId;
		dashApiPath = `${apiPathBase}community/${activeId}`;
		benchmarkApiPath = `${apiPathBase}communityBenchmark/${activeId}`;
	}
	if (activeTargetType === 'pub') {
		activeId = scopeData.elements.activeIds.pubId;
		dashApiPath = `${apiPathBase}pub/${activeId}`;
		benchmarkApiPath = `${apiPathBase}pubBenchmark/${activeId}`;
	}
	const isCollection = activeTargetType === 'collection';

	useEffect(() => {
		apiFetch(dashApiPath, {
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
		if (displayDataWarning) {
			apiFetch(benchmarkApiPath, {
				method: 'GET',
			})
				.then(({ token }) => {
					setMetabaseBenchmarkUrl(
						`https://metabase.pubpub.org/embed/dashboard/${token}#bordered=false&titled=false`,
					);
				})
				.catch((err) => {
					console.error(err);
				});
		}
	});

	return (
		<div className="dashboard-impact-container">
			<h2 className="dashboard-content-header">Impact</h2>
			{canView && isCollection && (
				<Callout>Collection-level impact data coming soon.</Callout>
			)}
			{canView && !isCollection && displayDataWarning && (
				<Callout intent="warning">
					Analytics data collected before April 30, 2020 used a different analytics system
					than data collected after April 30, 2020. As a result, the Users metric will be
					inconsistent between these two periods, and should not be used for direct
					comparisons. For more information, see our{' '}
					<a href="https://discourse.knowledgefutures.org/t/user-metric-discrepancies-between-july-12-2019-and-april-30-2020/259">
						explanatory Discourse post
					</a>{' '}
					and the <a href="#historical_benchmark">Historical Benchmark Dashboard</a>,
					below.
				</Callout>
			)}
			{canView ? (
				<iframe
					className="metabase main"
					src={metabaseUrl}
					title="Analytics"
					frameBorder="0"
				/>
			) : (
				<p>Login or ask the community administrator for access to impact data.</p>
			)}
			{canView && displayDataWarning && (
				<React.Fragment>
					<h3 id="historical_benchmark">Historical User Benchmark</h3>
					<Callout>
						This dashboard shows the historical user metric (prior to April 30, 2020)
						graphed against the new user metric during an overlap period, for making
						comparisons between the two. For more information, see our{' '}
						<a href="https://discourse.knowledgefutures.org/t/user-metric-discrepancies-between-july-12-2019-and-april-30-2020/259">
							explanatory Discourse post
						</a>
					</Callout>
					<iframe
						className="metabase benchmark"
						src={metabaseBenchmarkUrl}
						title="Benchmark"
						frameBorder="0"
					/>
				</React.Fragment>
			)}
		</div>
	);
};

DashboardImpact.propTypes = propTypes;
export default DashboardImpact;
