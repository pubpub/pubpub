import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MultiSelect } from '@blueprintjs/select';
import fuzzysearch from 'fuzzysearch';
import { apiFetch } from 'utilities';

require('./pubOptionsPages.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	// loginData: PropTypes.object.isRequired,
	setPubData: PropTypes.func.isRequired,
};

class PubOptionsPages extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			activeCollections: props.pubData.collections,
		};
		this.getFilteredItems = this.getFilteredItems.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleAddCollection = this.handleAddCollection.bind(this);
		this.handleRemoveCollection = this.handleRemoveCollection.bind(this);
		this.showSaveSuccess = this.showSaveSuccess.bind(this);
	}

	getFilteredItems(allCollections, activeCollections, query) {
		const usedIndexes = activeCollections.map((item)=> {
			return item.id;
		});
		return allCollections.filter((item)=> {
			const fuzzyMatchName = fuzzysearch(query.toLowerCase(), item.title.toLowerCase());
			const fuzzyMatchSlug = fuzzysearch(query.toLowerCase(), item.slug.toLowerCase());
			const alreadyUsed = usedIndexes.indexOf(item.id) > -1;
			return !alreadyUsed && (fuzzyMatchName || fuzzyMatchSlug) && !item.isPage;
		}).sort((foo, bar)=> {
			if (foo.title.toLowerCase() < bar.title.toLowerCase()) { return -1; }
			if (foo.title.toLowerCase() > bar.title.toLowerCase()) { return 1; }
			return 0;
		});
	}

	handleInputChange(evt) {
		const query = evt.target.value;

		return this.setState({ value: query });
	}

	handleAddCollection(newCollection) {
		this.setState({
			activeCollections: [...this.state.activeCollections, newCollection],
			value: '',
		});


		const addCollectionObject = {
			pubId: this.props.pubData.id,
			collectionId: newCollection.id,
		};

		apiFetch('/api/collectionPubs', {
			method: 'POST',
			body: JSON.stringify({
				...addCollectionObject,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			this.props.setPubData({
				...this.props.pubData,
				collections: [
					...this.props.pubData.collections,
					result,
				]
			});
			this.showSaveSuccess();
		});
	}

	handleRemoveCollection(evt, index) {
		if (this.state.activeCollections.length === 1) { return null; }
		const removedCollection = this.state.activeCollections[index];
		this.setState({
			activeCollections: this.state.activeCollections.filter((item, filterIndex)=> {
				return filterIndex !== index;
			})
		});

		const removeCollectionObject = {
			pubId: this.props.pubData.id,
			collectionId: removedCollection.id,
		};

		return apiFetch('/api/collectionPubs', {
			method: 'DELETE',
			body: JSON.stringify({
				...removeCollectionObject,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			this.props.setPubData({
				...this.props.pubData,
				collections: this.props.pubData.collections.filter((item)=> {
					return item.id !== result;
				})
			});
			this.showSaveSuccess();
		});
	}

	showSaveSuccess() {
		this.setState({ saveSuccess: true });
		setTimeout(()=> {
			this.setState({ saveSuccess: false });
		}, 2500);
	}

	render() {
		return (
			<div className="pub-options-details-component">
				<div className="save-wrapper">
					<div className={`save-success-message ${this.state.saveSuccess && !this.state.hasUpdated ? 'active' : ''}`}>
						<span className="pt-icon-standard pt-icon-tick-circle" /> Saved
					</div>
				</div>
				<h1>Pages</h1>

				<div className="details">
					Use the below input to set which Collections this pub is listed in.
				</div>
				<div className="details">
					Pubs must be listed in at least one Collection.
				</div>

				{this.state.activeCollections.length === 1 &&
					<style>
						{`
							.pt-tag-remove { display: none; }
						`}
					</style>
				}

				<div className="multiselect-wrapper">
					<MultiSelect
						items={this.getFilteredItems(this.props.communityData.collections, this.state.activeCollections, this.state.value)}
						itemRenderer={(item, { handleClick, isActive })=> {
							return (
								<li key={item.id}>
									<a role="button" tabIndex={-1} onClick={handleClick} className={isActive ? 'pt-menu-item pt-active' : 'pt-menu-item'}>
										{!item.isPublic &&
											<span className="pt-icon-standard pt-icon-lock2 pt-align-left" />
										}
										{item.title}
									</a>
								</li>
							);
						}}
						selectedItems={this.state.activeCollections}
						tagRenderer={(item)=> {
							return (
								<span>
									{!item.isPublic &&
										<span className="pt-icon-standard pt-icon-lock2 pt-align-left" />
									}
									{item.title}
								</span>
							);
						}}
						tagInputProps={{
							className: 'pt-large',
							onRemove: this.handleRemoveCollection,
							placeholder: 'Add Pub to Collection',
							tagProps: {
								className: 'pt-minimal pt-intent-primary'
							},
							inputProps: {
								onChange: this.handleInputChange,
							}
						}}
						resetOnSelect={true}
						onItemSelect={this.handleAddCollection}
						noResults={<div className="pt-menu-item">No Matching Collections</div>}
						popoverProps={{ popoverClassName: 'pt-minimal pub-options-pages-overlay' }}
					/>
				</div>
			</div>
		);
	}
}

PubOptionsPages.propTypes = propTypes;
export default PubOptionsPages;
