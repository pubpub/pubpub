import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, EditableText, Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import fuzzysearch from 'fuzzysearch';
import { apiFetch } from 'utilities';

require('./dashboardTags.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	// onAddAdmin: PropTypes.func,
	// onRemoveAdmin: PropTypes.func,
};
const defaultProps = {
	// onAddAdmin: ()=>{},
	// onRemoveAdmin: ()=>{},
};

class DashboardTags extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newTagValue: ''
		};
		this.handleTagCreate = this.handleTagCreate.bind(this);
		this.handleTagUpdate = this.handleTagUpdate.bind(this);
		this.handleTagDelete = this.handleTagDelete.bind(this);
	}

	handleTagCreate(evt) {
		evt.preventDefault();
		return apiFetch('/api/tags', {
			method: 'POST',
			body: JSON.stringify({
				title: this.state.newTagValue,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			window.location.reload();
		});
	}

	handleTagUpdate(updatedTag) {
		return apiFetch('/api/tags', {
			method: 'PUT',
			body: JSON.stringify({
				...updatedTag,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			window.location.reload();
		});
	}

	handleTagDelete(tagId) {
		return apiFetch('/api/tags', {
			method: 'DELETE',
			body: JSON.stringify({
				tagId: tagId,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			window.location.reload();
		});
	}

	render() {
		return (
			<div className="dashboard-tags-component">
				<h1 className="content-title">Tags</h1>
				<div className="details">Tags can be used to organize content and can be used to flow content onto pages.</div>

				<div className="autocomplete-wrapper">
					<form onSubmit={this.handleTagCreate}>
						<input
							className="pt-input pt-large"
							type="text"
							placeholder="Create new tag..."
							value={this.state.newTagValue}
							onChange={(evt)=> {
								this.setState({ newTagValue: evt.target.value });
							}}
						/>
					</form>
				</div>

				{this.props.communityData.tags.sort((foo, bar)=> {
					if (foo.title < bar.title) { return -1; }
					if (foo.title > bar.title) { return 1; }
					return 0;
				}).map((tag)=> {
					return (
						<div key={`tag-${tag.id}`} className="tag-wrapper">
							<div className="title">
								<EditableText
									defaultValue={tag.title}
									onConfirm={(newTitle)=> {
										this.handleTagUpdate({
											title: newTitle,
											tagId: tag.id,
										});
									}}
								/>
							</div>
							<Select
								items={this.props.communityData.pages}
								itemRenderer={(item, { handleClick, modifiers })=> {
									return (
										<button
											type="button"
											tabIndex={-1}
											onClick={handleClick}
											className={modifiers.active ? 'pt-menu-item pt-active' : 'pt-menu-item'}
										>
											{item.title}
										</button>
									);
								}}
								itemListPredicate={(query, items)=> {
									return items.filter((item)=> {
										return fuzzysearch(query.toLowerCase(), item.title.toLowerCase());
									});
								}}
								onItemSelect={(item)=> {
									this.handleTagUpdate({
										pageId: item.id,
										tagId: tag.id,
									});
								}}
								popoverProps={{ popoverClassName: 'pt-minimal' }}
							>
								<Button text={tag.page ? `Linked to: ${tag.page.title}` : 'Link to Page'} rightIcon="caret-down" />
							</Select>
							<Checkbox
								checked={!tag.isPublic}
								onChange={(evt)=> {
									this.handleTagUpdate({
										isPublic: !evt.target.checked,
										tagId: tag.id,
									});
								}}
							>
								Private
							</Checkbox>
							<button
								type="button"
								className="pt-button pt-icon-small-cross pt-minimal"
								onClick={()=> {
									this.handleTagDelete(tag.id);
								}}
							/>
						</div>
					);
				})}
			</div>
		);
	}
}

DashboardTags.propTypes = propTypes;
DashboardTags.defaultProps = defaultProps;
export default DashboardTags;
