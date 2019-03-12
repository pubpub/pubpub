import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, EditableText, Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import fuzzysearch from 'fuzzysearch';
import { apiFetch } from 'utilities';

require('./dashboardCollections.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	setCommunityData: PropTypes.func.isRequired,
};

class DashboardCollections extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newCollectionValue: '',
			error: undefined,
		};
		this.handleCollectionCreate = this.handleCollectionCreate.bind(this);
		this.handleCollectionUpdate = this.handleCollectionUpdate.bind(this);
		this.handleCollectionDelete = this.handleCollectionDelete.bind(this);
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

	render() {
		return (
			<div className="dashboard-collections-component">
				<h1 className="content-title">Collections</h1>
				<div className="details">
					Collections can be used to organize content and can be used to flow content onto
					pages.
				</div>

				<div className="autocomplete-wrapper">
					<form onSubmit={this.handleCollectionCreate}>
						<input
							className="bp3-input bp3-large"
							type="text"
							placeholder="Create new collection..."
							value={this.state.newCollectionValue}
							onChange={(evt) => {
								this.setState({ newCollectionValue: evt.target.value });
							}}
						/>
					</form>
					{this.state.error && <p className="error">{this.state.error}</p>}
				</div>

				{this.props.communityData.collections
					.sort((foo, bar) => {
						if (foo.title < bar.title) {
							return -1;
						}
						if (foo.title > bar.title) {
							return 1;
						}
						return 0;
					})
					.map((collection) => {
						return (
							<div key={`collection-${collection.id}`} className="collection-wrapper">
								<div className="title">
									<EditableText
										defaultValue={collection.title}
										onConfirm={(newTitle) => {
											this.handleCollectionUpdate({
												title: newTitle,
												collectionId: collection.id,
											});
										}}
									/>
								</div>
								<Select
									items={this.props.communityData.pages}
									itemRenderer={(item, { handleClick, modifiers }) => {
										return (
											<button
												type="button"
												tabIndex={-1}
												onClick={handleClick}
												className={
													modifiers.active
														? 'bp3-menu-item bp3-active'
														: 'bp3-menu-item'
												}
											>
												{item.title}
											</button>
										);
									}}
									itemListPredicate={(query, items) => {
										return items.filter((item) => {
											return fuzzysearch(
												query.toLowerCase(),
												item.title.toLowerCase(),
											);
										});
									}}
									onItemSelect={(item) => {
										this.handleCollectionUpdate({
											pageId: item.id,
											collectionId: collection.id,
										});
									}}
									popoverProps={{ popoverClassName: 'bp3-minimal' }}
								>
									<Button
										text={
											collection.page
												? `Linked to: ${collection.page.title}`
												: 'Link to Page'
										}
										rightIcon="caret-down"
									/>
								</Select>
								<Checkbox
									checked={!collection.isPublic}
									onChange={(evt) => {
										this.handleCollectionUpdate({
											isPublic: !evt.target.checked,
											collectionId: collection.id,
										});
									}}
								>
									Private
								</Checkbox>
								<button
									type="button"
									className="bp3-button bp3-icon-small-cross bp3-minimal"
									onClick={() => {
										this.handleCollectionDelete(collection.id);
									}}
								/>
							</div>
						);
					})}
			</div>
		);
	}
}

DashboardCollections.propTypes = propTypes;
export default DashboardCollections;
