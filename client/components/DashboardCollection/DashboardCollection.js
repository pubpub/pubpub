/**
 * Renders the dashboard options for a single collection
 */
import React from 'react';
import PropTypes from 'prop-types';
import { NonIdealState, Tabs, Tab } from '@blueprintjs/core';
import CollectionEditor from '../CollectionEditor/CollectionEditor';
import CollectionEditorManaged from '../CollectionEditor/CollectionEditorManaged';
import AttributionEditor from '../AttributionEditor/AttributionEditor';

require('./dashboardCollection.scss');

const LINK_TO_COLLECTIONS = '/dashboard/collections';

const propTypes = {};

class DashboardCollection extends React.Component {
	renderContentsEditor() {
		const { collection, pubsData } = this.props;
		return <CollectionEditorManaged collection={collection} pubs={pubsData} selections={[]} />;
	}

	renderAttributionEditor() {
		const { collection, communityData } = this.props;
		return (
			<AttributionEditor
				apiRoute="/api/collectionAttributions"
				canEdit={true}
				attributions={collection.attributions}
				identifyingProps={{ collectionId: collection.id, communityId: communityData.id }}
			/>
		);
	}

	renderMetadataEditor() {
		return null;
	}

	renderEmptyState() {
		return (
			<NonIdealState
				icon="help"
				title="No collection found here"
				description={<a href={LINK_TO_COLLECTIONS}>Return to all collections</a>}
			/>
		);
	}

	renderTabs() {
		return (
			<Tabs
				id="collection"
				onChange={this.handleTabChange}
				selectedTab="contents"
				className="tab-container"
			>
				<Tab id="contents" title="Contents" panel={this.renderContentsEditor()} />
				<Tab id="attribution" title="Attribution" panel={this.renderAttributionEditor()} />
				<Tab id="metadata" title="Metadata" panel={this.renderMetadataEditor()} />
			</Tabs>
		);
	}

	render() {
		const { communityData, collection } = this.props;
		if (collection) {
			return (
				<div className="component-dashboard-collection">
					<h1>
						<a style={{ color: communityData.accentColor }} href={LINK_TO_COLLECTIONS}>
							Collections
						</a>{' '}
						&rsaquo; {collection.title}
					</h1>
					{this.renderTabs()}
				</div>
			);
		}
		return this.renderEmptyState();
	}
}

DashboardCollection.propTypes = propTypes;
export default DashboardCollection;
