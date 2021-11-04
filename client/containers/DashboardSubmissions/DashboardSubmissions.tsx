import React from 'react';
import { Button, Callout } from '@blueprintjs/core';

import { DashboardFrame } from 'components';
import { usePageContext } from 'utils/hooks';
import { communityUrl } from 'utils/canonicalUrls';
import { getDashUrl } from 'utils/dashboard';

import SubmissionWorkflowEditor from './SubmissionWorkflowEditor';

require('./dashboardSubmissions.scss');

const DashboardSubmissions = () => {
	const {
		communityData,
		scopeData: {
			elements: { activeCollection },
		},
	} = usePageContext();
	const collectionUrl = communityUrl(communityData) + `/${activeCollection.slug}`;

	const renderIntroduction = () => {
		const pageLinkedToCollection = communityData.pages.find(
			(page) => page.id === activeCollection.pageId,
		);
		return (
			<Callout
				title="Enable Submissions"
				intent={pageLinkedToCollection ? 'warning' : 'primary'}
				icon={null}
			>
				<p>
					When you enable Submissions for this Collection, anyone with a PubPub account
					will be able to visit{' '}
					<a href={collectionUrl} target="_blank" rel="noopener noreferrer">
						{collectionUrl}
					</a>{' '}
					to create a Pub and submit it to this Collection. You'll have the chance to
					approve or reject these submissions before they can be published.
				</p>
				{!pageLinkedToCollection && <Button>Let's do it!</Button>}
				{pageLinkedToCollection && (
					<p>
						Before you can start accepting Submissions, you'll need to unlink this
						Collection from the Page <b>{pageLinkedToCollection.title}</b> from the{' '}
						<a
							href={getDashUrl({
								collectionSlug: activeCollection.slug,
								mode: 'layout',
							})}
						>
							Layout tab
						</a>
						.
					</p>
				)}
			</Callout>
		);
	};

	const renderInitialCreationWorkflow = () => {
		return <SubmissionWorkflowEditor initialWorkflow={null} collectionUrl={collectionUrl} />;
	};

	return (
		<DashboardFrame
			className="dashboard-submissions-container"
			title="Submissions"
			icon="inbox"
		>
			{/* {renderIntroduction()} */}
			{renderInitialCreationWorkflow()}
		</DashboardFrame>
	);
};

export default DashboardSubmissions;
