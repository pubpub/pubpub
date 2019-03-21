import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ControlGroup, InputGroup, NonIdealState } from '@blueprintjs/core';
import { apiFetch } from 'utilities';

import { getSchemaForKind } from 'shared/collections/schemas';
import CollectionKindDropdown from './CollectionKindDropdown';
import CollectionRow from './CollectionRow';

require('./dashboardCollections.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubsData: PropTypes.object.isRequired,
	setCommunityData: PropTypes.func.isRequired,
};
class DashboardCollections extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newCollectionValue: '',
			currentCollectionSchema: getSchemaForKind('tag'),
			error: undefined,
		};
		this.handleCollectionCreate = this.handleCollectionCreate.bind(this);
		this.handleCollectionUpdate = this.handleCollectionUpdate.bind(this);
		this.handleCollectionDelete = this.handleCollectionDelete.bind(this);
	}

	getDisplayableCollections() {
		const {
			currentCollectionSchema: { kind: currentKind },
		} = this.state;
		return this.props.communityData.collections
			.filter((collection) => collection.kind === currentKind)
			.sort((foo, bar) => {
				if (foo.title < bar.title) {
					return -1;
				}
				if (foo.title > bar.title) {
					return 1;
				}
				return 0;
			});
	}

	handleCollectionCreate(evt) {
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

		this.setState({ error: undefined });
		return apiFetch('/api/collections', {
			method: 'POST',
			body: JSON.stringify({
				title: this.state.newCollectionValue,
				communityId: this.props.communityData.id,
				kind: this.state.currentCollectionSchema.kind,
			}),
		}).then((newCollection) => {
			this.setState({ newCollectionValue: '' });
			this.props.setCommunityData({
				...this.props.communityData,
				collections: [...this.props.communityData.collections, newCollection],
			});
		});
	}

	handleCollectionUpdate(updatedCollection) {
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
					if (collection.id !== updatedCollection.collectionId) {
						return collection;
					}
					if (!updatedCollection.pageId) {
						return { ...collection, ...updatedCollection };
					}
					return {
						...collection,
						...updatedCollection,
						page: this.props.communityData.pages.reduce((prev, curr) => {
							if (curr.id === updatedCollection.pageId) {
								return curr;
							}
							return prev;
						}, undefined),
					};
				}),
			});
		});
	}

	handleCollectionDelete(collectionId) {
		return apiFetch('/api/collections', {
			method: 'DELETE',
			body: JSON.stringify({
				collectionId: collectionId,
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

	renderTopControlGroup() {
		const { currentCollectionSchema } = this.state;
		const label = currentCollectionSchema.label.singular.toLowerCase();
		// TODO(ian): figure out how to grow the InputGroup without resorting to CSS
		return (
			<form onSubmit={this.handleCollectionCreate}>
				<ControlGroup>
					<CollectionKindDropdown
						selectedSchema={currentCollectionSchema}
						onSelect={(schema) => this.setState({ currentCollectionSchema: schema })}
						large={true}
					/>

					<InputGroup
						placeholder={`Create a new ${label}...`}
						onChange={(evt) => {
							this.setState({ newCollectionValue: evt.target.value });
						}}
						large={true}
						value={this.state.newCollectionValue}
						className="add-collection-input"
					/>
				</ControlGroup>
			</form>
		);
	}

	render() {
		const displayableCollections = this.getDisplayableCollections();
		const {
			currentCollectionSchema: {
				label: { plural: emptyStateLabel },
				bpDisplayIcon,
			},
		} = this.state;
		return (
			<div className="dashboard-collections-component">
				<h1 className="content-title">Collections</h1>
				<div className="details">You can use collections to yadda yadda yadda</div>
				<div className="autocomplete-wrapper">
					{this.renderTopControlGroup()}
					{this.state.error && <p className="error">{this.state.error}</p>}
				</div>
				{displayableCollections.length === 0 && (
					<NonIdealState
						title={`Your community doesn't have any ${emptyStateLabel}!`}
						description="Why don't you try creating one?"
						icon={bpDisplayIcon}
					/>
				)}
				{displayableCollections.map((collection) => (
					<CollectionRow
						communityData={this.props.communityData}
						pubsData={this.props.pubsData}
						collection={collection}
						key={collection.id}
						onCollectionUpdate={this.handleCollectionUpdate}
						onCollectionDelete={this.handleCollectionDelete}
					/>
				))}
			</div>
		);
	}
}

DashboardCollections.propTypes = propTypes;
export default DashboardCollections;
