import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { apiFetch } from 'utilities';

require('./pubOptionsReview.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	// loginData: PropTypes.object.isRequired,
	setPubData: PropTypes.func.isRequired,
};

class PubOptionsReview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
		};

		this.handleReviewUpdate = this.handleReviewUpdate.bind(this);
	}

	handleReviewUpdate(newReviewObject) {
		this.setState({ isLoading: true });

		return apiFetch('/api/pubs', {
			method: 'PUT',
			body: JSON.stringify({
				review: newReviewObject,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.setState({ isLoading: false });
			this.props.setPubData({
				...this.props.pubData,
				review: newReviewObject,
			});
		})
		.catch((err)=> {
			console.error(err);
			this.setState({ isLoading: false });
		});
	}

	render() {
		const pubData = this.props.pubData;
		const review = pubData.review || {};
		// TODO: permissions in pub.js should let communityAdmins update review even if they are not pubManagers
		// TODO: there are certain types of actions on a review object that only certain parties can make.
		// TODO: who has access to comment/review
		// TODO: automated review services? Plagiarism, spellcheck, etc
		// Integration with discussions?
		// Likely a separate table of reviewItems. Certain users can only create certain types of reviewItems
		// You aggregate the list of all review items for a pub
		// Review events:
		// 	- Open review
		// 	- Close review
		// 	- Set review complete
		//  - Set active review version
		// 	- Add review text
		// 	- Add review changes
		// 	- Assign reviewers
		// 	- 

		// Option to move to public is when everyone in a channel approves (or - channel has 'publicTransfer request approver')
		// Types:
		//  - Multiple reviewers in parallel, all in separate channels
		//  - Multiple reviewers in order, all in separate/same channel
		//  - Multiple reviewers in private from author
		// 	- Keep everything private from author until outline completed?
		
		return (
			<div className="pub-options-review-component">
				<h1>Review</h1>

				<Select
					items={this.props.pubData.versions}
					filterable={false}
					itemRenderer={(item, { handleClick, modifiers })=> {
						return (
							<button
								type="button"
								tabIndex={-1}
								onClick={handleClick}
								className={modifiers.active ? 'pt-menu-item pt-active' : 'pt-menu-item'}
							>
								{item.id}
							</button>
						);
					}}
					onItemSelect={(item)=> {
						console.log(item);
					}}
					popoverProps={{ popoverClassName: 'pt-minimal' }}
				>
					<Button text="Select a Version" rightIcon="caret-down" />
				</Select>
				<Button
					className={review.status === 'none' ? 'pt-active' : ''}
					text="None"
					loading={this.state.isLoading}
					onClick={()=> {
						this.handleReviewUpdate({ status: 'none' });
					}}
				/>
				<Button
					className={review.status === 'submitted' ? 'pt-active' : ''}
					text="Submit"
					loading={this.state.isLoading}
					onClick={()=> {
						this.handleReviewUpdate({ status: 'submitted' });
					}}
				/>
				<Button
					className={review.status === 'complete' ? 'pt-active' : ''}
					text="Complete"
					loading={this.state.isLoading}
					onClick={()=> {
						this.handleReviewUpdate({ status: 'complete' });
					}}
				/>
			</div>
		);
	}
}

PubOptionsReview.propTypes = propTypes;
export default PubOptionsReview;
