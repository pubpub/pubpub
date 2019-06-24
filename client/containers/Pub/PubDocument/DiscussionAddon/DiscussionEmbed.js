import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
// import { Card } from '@blueprintjs/core';
// import DiscussionThread from 'deprecatedComponents/DiscussionThread/DiscussionThread';
// import DiscussionThread from '../PubDiscussions/DiscussionThread';
// import { nestDiscussionsToThreads } from '../PubDiscussions/discussionUtils';

require('./discussionEmbed.scss');

const propTypes = {
	attrs: PropTypes.object.isRequired,
	options: PropTypes.object.isRequired,
	isSelected: PropTypes.bool.isRequired,
	isEditable: PropTypes.bool.isRequired,
};

const DiscussionEmbed = (props) => {
	const figFloat =
		props.attrs.align === 'left' || props.attrs.align === 'right' ? props.attrs.align : 'none';
	let figMargin = '0em auto 1em';
	if (props.attrs.align === 'left') {
		figMargin = '1em 1em 1em 0px';
	}
	if (props.attrs.align === 'right') {
		figMargin = '1em 0px 1em 1em';
	}
	const figWidth = props.attrs.align === 'full' ? '100%' : '60%';
	const figStyle = {
		width: figWidth,
		margin: figMargin,
		float: figFloat,
		padding: '1em 1em 0em',
	};

	// const threadElement = props.options.getThreadElement(props.attrs.threadNumber);
	const containerRef = useRef(null);
	const embedId = uuidv4();
	useEffect(() => {
		// console.log('in embed effect');
		// props.options.renderPortal(containerRef, props.attrs.threadNumber);
		props.options.addRef(embedId, containerRef, props.attrs.threadNumber);
		return () => {
			props.options.removeRef(embedId);
		};
	}, []);
	return (
		<div className="figure-wrapper" tabIndex={-1}>
			<figure
				className={`discussion bp3-elevation-2 ${props.isSelected ? 'isSelected' : ''} ${
					props.isEditable ? 'isEditable' : ''
				}`}
				style={figStyle}
				ref={containerRef}
			>
				{/* props.options.renderPortal(containerRef, props.attrs.threadNumber) */}
				{/* threadElement */}

				{/* !threadElement && <Card>Please select a discussion from the formatting bar.</Card> */}
			</figure>
		</div>
	);
};

// class DiscussionEmbed extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {};
// 	}

// 	render() {
// 		const figFloat =
// 			this.props.attrs.align === 'left' || this.props.attrs.align === 'right'
// 				? this.props.attrs.align
// 				: 'none';
// 		let figMargin = '0em auto 1em';
// 		if (this.props.attrs.align === 'left') {
// 			figMargin = '1em 1em 1em 0px';
// 		}
// 		if (this.props.attrs.align === 'right') {
// 			figMargin = '1em 0px 1em 1em';
// 		}
// 		const figWidth = this.props.attrs.align === 'full' ? '100%' : '60%';
// 		const figStyle = {
// 			width: figWidth,
// 			margin: figMargin,
// 			float: figFloat,
// 		};

// 		const threadElement = this.props.options.getThreadElement(this.props.attrs.threadNumber);
// 		// const {
// 		// 	pubData,
// 		// 	collabData,
// 		// 	firebaseBranchRef,
// 		// 	updateLocalData,
// 		// } = this.props.options.getInputProps();
// 		// const threads = nestDiscussionsToThreads(pubData.discussions);
// 		// const threads = this.props.options.getThreads();
// 		// const pubData = this.props.options.getPubData();
// 		// const locationData = this.props.options.getLocationData();
// 		// const loginData = this.props.options.getLoginData();
// 		// const onPostDiscussion = this.props.options.getOnPostDiscussion();
// 		// const onPutDiscussion = this.props.options.getOnPutDiscussion();
// 		// const getHighlightContent = this.props.options.getGetHighlightContent();
// 		// const handleQuotePermalink = this.props.options.getHandleQuotePermalink();
// 		// const activeThread = threads.reduce((prev, curr) => {
// 		// 	if (curr[0].threadNumber === this.props.attrs.threadNumber) {
// 		// 		return curr;
// 		// 	}
// 		// 	return prev;
// 		// }, undefined);

// 		return (
// 			<div className="figure-wrapper">
// 				<figure
// 					className={`discussion bp3-elevation-2 ${
// 						this.props.isSelected ? 'isSelected' : ''
// 					} ${this.props.isEditable ? 'isEditable' : ''}`}
// 					style={figStyle}
// 				>
// 					{threadElement}
// 					{/* activeThread && (
// 						<DiscussionThread
// 							key={`thread-${activeThread[0].id}`}
// 							thread={activeThread}
// 							isMinimal={false}
// 							pubData={pubData}
// 							locationData={locationData}
// 							loginData={loginData}
// 							onPostDiscussion={(data) => {
// 								return onPostDiscussion(data).then(() => {
// 									this.setState({});
// 								});
// 							}}
// 							onPutDiscussion={(data) => {
// 								return onPutDiscussion(data).then(() => {
// 									this.setState({});
// 								});
// 							}}
// 							getHighlightContent={getHighlightContent}
// 							handleQuotePermalink={handleQuotePermalink}
// 						/>
// 					) */}
// 					{!threadElement && (
// 						<Card>Please select a discussion from the formatting bar.</Card>
// 					)}
// 				</figure>
// 			</div>
// 		);
// 	}
// }

DiscussionEmbed.propTypes = propTypes;
export default DiscussionEmbed;
