import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import fuzzysearch from 'fuzzysearch';
import {
	Button,
	Card,
	ControlGroup,
	InputGroup,
	Icon,
	Overlay,
	Tabs,
	Tab,
} from '@blueprintjs/core';
import { Classes as SelectClasses } from '@blueprintjs/select';
import { apiFetch } from 'utilities';

import { getSchemaForKind } from 'shared/collections/schemas';
import CollectionKindDropdown from './CollectionKindDropdown';
import CollectionRow from './CollectionRow';
import CollectionTile from './CollectionTile';

require('./dashboardCollections.scss');
require('@blueprintjs/select/src/blueprint-select.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubsData: PropTypes.object.isRequired,
	setCommunityData: PropTypes.func.isRequired,
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const NewCollectionCard = ({ schema, description, header }) => {
	const [isOpen, setIsOpen] = useState(false);
	const {
		bpDisplayIcon,
		label: { singular: collectionLabel },
	} = schema;
	return (
		<React.Fragment>
			<Overlay
				className={classNames('new-collection-card-overlay', SelectClasses.OMNIBAR_OVERLAY)}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				hasBackdrop={true}
				usePortal={true}
			>
				<div className={SelectClasses.OMNIBAR}>
					<InputGroup
						autoFocus={true}
						leftIcon={bpDisplayIcon}
						placeholder={`Name a new ${collectionLabel}...`}
						large={true}
					/>
				</div>
			</Overlay>
			<Card className="top-controls-card" elevation={1} onClick={() => setIsOpen(true)}>
				<h6>
					<Icon icon={bpDisplayIcon} iconSize={20} />
					{header}
				</h6>
				<p>{description}</p>
			</Card>
		</React.Fragment>
	);
};

NewCollectionCard.propTypes = {
	schema: PropTypes.shape({
		bpDisplayIcon: PropTypes.string.isRequired,
		label: {
			singular: PropTypes.string,
		},
	}).isRequired,
	header: PropTypes.string.isRequired,
	description: PropTypes.node.isRequired,
};
class DashboardCollections extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			matchCollectionQuery: null,
		};
		this.handleCreateCollection = this.handleCreateCollection.bind(this);
		this.handleUpdateCollection = this.handleUpdateCollection.bind(this);
		this.handleDeleteCollection = this.handleDeleteCollection.bind(this);
	}

	getShownCollections() {
		const {
			communityData: { collections },
		} = this.props;
		const { matchCollectionQuery } = this.state;
		return collections.filter(
			(collection) =>
				!matchCollectionQuery ||
				fuzzysearch(matchCollectionQuery.toLowerCase(), collection.title.toLowerCase()),
		);
	}

	shouldShowTabs() {
		const {
			communityData: { collections },
		} = this.props;
		return (
			collections.some((c) => c.kind === 'tag') && collections.some((c) => c.kind !== 'tag')
		);
	}

	handleCreateCollection(evt) {
		evt.preventDefault();
		const isUniqueTitle = this.props.communityData.collections.reduce((prev, curr) => {
			if (curr.title === this.state.newCollectionValue) {
				return false;
			}
			return prev;
		}, true);

		if (!isUniqueTitle) {
			return this.setState((prevState) => {
				return { error: `'${prevState.newCollectionValue}' already exists.` };
			});
		}
		this.setState({ error: null });
		return apiFetch('/api/collections', {
			method: 'POST',
			body: JSON.stringify({
				title: this.state.newCollectionValue,
				communityId: this.props.communityData.id,
				kind: this.state.currentCollectionSchema.kind,
			}),
		}).then((newCollection) => {
			this.props.setCommunityData({
				...this.props.communityData,
				collections: [...this.props.communityData.collections, newCollection],
			});
		});
	}

	handleUpdateCollection(updatedCollection) {
		return apiFetch('/api/collections', {
			method: 'PUT',
			body: JSON.stringify({
				...updatedCollection,
				communityId: this.props.communityData.id,
			}),
		}).then(() => {
			this.props.setCommunityData({
				...this.props.communityData,
				collections: this.props.communityData.collections.map((collection) => {
					if (collection.id !== updatedCollection.id) {
						return collection;
					}
					if (!Object.keys(updatedCollection).includes('pageId')) {
						return { ...collection, ...updatedCollection };
					}
					return {
						...collection,
						...updatedCollection,
						page: this.props.communityData.pages.find(
							(page) => page.id === updatedCollection.pageId,
						),
					};
				}),
			});
		});
	}

	handleDeleteCollection(collectionId) {
		return apiFetch('/api/collections', {
			method: 'DELETE',
			body: JSON.stringify({
				id: collectionId,
				communityId: this.props.communityData.id,
			}),
		}).then(() => {
			this.props.setCommunityData({
				...this.props.communityData,
				collections: this.props.communityData.collections.filter((collection) => {
					return collection.id !== collectionId;
				}),
			});
		});
	}

	renderTopControlGroupNot() {
		const { currentCollectionSchema, isCreatingCollection } = this.state;
		const label = currentCollectionSchema.label.singular.toLowerCase();
		// TODO(ian): figure out how to grow the InputGroup without resorting to CSS
		return (
			<form onSubmit={this.handleCreateCollection}>
				<ControlGroup>
					<InputGroup
						placeholder={`Create a new ${label}...`}
						onChange={(evt) => {
							this.setState({ newCollectionValue: evt.target.value });
						}}
						large={true}
						value={this.state.newCollectionValue}
						className="add-collection-input"
					/>
					<CollectionKindDropdown
						selectedSchema={currentCollectionSchema}
						onSelect={(schema) => this.setState({ currentCollectionSchema: schema })}
						large={true}
					/>
					<Button large={true} type="submit" loading={isCreatingCollection}>
						Create
					</Button>
				</ControlGroup>
			</form>
		);
	}

	renderTopControlGroup() {
		return (
			<div className="top-controls">
				<div className="top-controls-cards">
					<NewCollectionCard
						schema={getSchemaForKind('tag')}
						header="Create a tag"
						description={
							<React.Fragment>
								A lightweight collection of thematically related pubs
							</React.Fragment>
						}
					/>
					<NewCollectionCard
						schema={getSchemaForKind('issue')}
						header="Create an issue"
						description={
							<React.Fragment>
								Organize your pubs into an issue of your journal
							</React.Fragment>
						}
					/>
					<NewCollectionCard
						schema={getSchemaForKind('book')}
						header="Create a book"
						description={
							<React.Fragment>
								Arrange pubs into chapters for a longer reading experience
							</React.Fragment>
						}
					/>
					<NewCollectionCard
						schema={getSchemaForKind('conference')}
						header="Create a conference"
						description={<React.Fragment>Host a conference on PubPub</React.Fragment>}
					/>
				</div>
			</div>
		);
	}

	renderCollectionGroup(kind, collections) {
		const schema = getSchemaForKind(kind);
		const title = capitalize(schema.label.plural);
		return (
			<div className="collection-group">
				<h2>{title}</h2>
				{collections.map((collection) => (
					<CollectionRow
						communityData={this.props.communityData}
						pubsData={this.props.pubsData}
						collection={collection}
						key={collection.id}
						onUpdateCollection={this.handleUpdateCollection}
						onDeleteCollection={this.handleDeleteCollection}
					/>
				))}
			</div>
		);
	}

	renderTabBar() {
		const { selectedTab, matchCollectionQuery } = this.state;
		if (!this.shouldShowTabs()) {
			return null;
		}
		return (
			<Tabs
				className="tabs"
				selectedTab={selectedTab}
				onChange={(tabId) => this.setState({ selectedTab: tabId })}
				id="dashboard-collections-kind-tabs"
				animate={false}
				large={true}
			>
				<Tab id="tags" title="Tags" />
				<Tab id="other-collections" title="Other collections" />
				<Tabs.Expander />
				<InputGroup
					leftIcon="search"
					value={matchCollectionQuery}
					onChange={(e) => this.setState({ matchCollectionQuery: e.target.value })}
					placeholder="Filter collections"
				/>
			</Tabs>
		);
	}

	renderCollections() {
		const { communityData } = this.props;
		return (
			<div className="collections">
				{this.getShownCollections().map((collection) => (
					<CollectionTile
						communityData={communityData}
						collection={collection}
						onDeleteCollection={this.handleDeleteCollection}
						onUpdateCollection={this.handleUpdateCollection}
					/>
				))}
			</div>
		);
	}

	render() {
		return (
			<div className="dashboard-collections-component">
				<h1 className="content-title">Collections</h1>
				{this.renderTopControlGroup()}
				{this.renderCollections()}
			</div>
		);
	}
}

DashboardCollections.propTypes = propTypes;
export default DashboardCollections;
