import PropTypes from 'prop-types';
import React from 'react';
import queryString from 'query-string';
import { dispatchEmptyTransaction } from '@pubpub/editor';

import { apiFetch, generateHash } from 'utilities';

import sharedPropTypes from './propTypes';
import { getThreads, getActiveDiscussionChannel } from './threads';

const propTypes = {
	children: PropTypes.func.isRequired,
	communityData: sharedPropTypes.communityData.isRequired,
	initialLocationData: sharedPropTypes.locationData.isRequired,
	loginData: sharedPropTypes.loginData.isRequired,
	pubData: sharedPropTypes.pubData.isRequired,
};

export default class PubDiscussionsManager extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeThreadNumber: undefined,
			initialDiscussionContent: undefined,
			locationData: props.initialLocationData,
		};
		this.bindHandlers();
	}

	getThreads() {
		const { pubData } = this.props;
		const { locationData } = this.state;
		return getThreads(pubData, locationData);
	}

	getDiscussionNodeOptions() {
		return {
			getThreads: () => {
				return this.getThreads();
			},
			getOnPostDiscussion: () => {
				return this.handlePostDiscussion;
			},
			getOnPutDiscussion: () => {
				return this.handlePutDiscussion;
			},
		};
	}

	getDiscussionHandlers() {
		return {
			onNewHighlightDiscussion: this.handleNewHighlightDiscussion,
			onPostDiscussion: this.handlePostDiscussion,
			onPutDiscussion: this.handlePutDiscussion,
			onSetActiveThread: this.handleSetActiveThread,
			onSetDiscussionChannel: this.handleSetDiscussionChannel,
		};
	}

	bindHandlers() {
		this.handleSetDiscussionChannel = this.handleSetDiscussionChannel.bind(this);
		this.handleSetActiveThread = this.handleSetActiveThread.bind(this);
		this.handlePostDiscussion = this.handlePostDiscussion.bind(this);
		this.handlePutDiscussion = this.handlePutDiscussion.bind(this);
		this.handleNewHighlightDiscussion = this.handleNewHighlightDiscussion.bind(this);
		// Not technically a handler, but we do weird scope things with this
		this.getThreads = this.getThreads.bind(this);
	}

	handleSetActiveThread(threadNumber) {
		// TODO: set highlight node
		this.setState({
			activeThreadNumber: threadNumber,
		});
	}

	handleCloseThreadOverlay() {
		this.setState({
			activeThreadNumber: undefined,
			initialDiscussionContent: undefined,
		});
	}

	handleNewHighlightDiscussion(highlightObject) {
		this.setState({
			activeThreadNumber: 'new',
			initialDiscussionContent: {
				type: 'doc',
				attrs: { meta: {} },
				content: [
					{
						type: 'highlightQuote',
						attrs: { ...highlightObject, id: `h${generateHash(8)}` },
					},
					{ type: 'paragraph', content: [] },
				],
			},
		});
	}

	handlePostDiscussion(discussionObject) {
		const activeDiscussionChannel = getActiveDiscussionChannel();
		return apiFetch('/api/discussions', {
			method: 'POST',
			body: JSON.stringify({
				...discussionObject,
				userId: this.props.loginData.id,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
				discussionChannelId: activeDiscussionChannel ? activeDiscussionChannel.id : null,
			}),
		})
			.then((result) => {
				this.setState(
					(prevState) => {
						return {
							activeThreadNumber:
								prevState.activeThreadNumber === 'new'
									? result.threadNumber
									: prevState.activeThreadNumber,
							pubData: {
								...prevState.pubData,
								discussions: [...prevState.pubData.discussions, result],
							},
						};
					},
					() => {
						dispatchEmptyTransaction(this.state.editorChangeObject.view);
					},
				);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	handlePutDiscussion(discussionObject) {
		return apiFetch('/api/discussions', {
			method: 'PUT',
			body: JSON.stringify({
				...discussionObject,
				communityId: this.props.communityData.id,
			}),
		}).then((result) => {
			this.setState((prevState) => {
				return {
					pubData: {
						...prevState.pubData,
						discussions: prevState.pubData.discussions.map((item) => {
							if (item.id !== result.id) {
								return item;
							}
							return {
								...item,
								...result,
							};
						}),
					},
				};
			});
		});
	}

	handleSetDiscussionChannel(channelTitle) {
		this.setState(
			(prevState) => {
				const newQuery = {
					...prevState.locationData.query,
					channel: channelTitle === 'public' ? undefined : channelTitle,
				};
				const newQueryString = Object.values(newQuery).filter((item) => !!item).length
					? `?${queryString.stringify(newQuery)}`
					: '';
				return {
					locationData: {
						...prevState.locationData,
						query: newQuery,
						queryString: newQueryString,
					},
				};
			},
			() => {
				dispatchEmptyTransaction(this.state.editorChangeObject.view);
				window.history.replaceState(
					{},
					'',
					`${this.state.locationData.path}${this.state.locationData.queryString}`,
				);
			},
		);
	}

	render() {
		const { children, pubData } = this.props;
		const { locationData, activeThreadNumber, initialDiscussionContent } = this.state;
		return children({
			activeDiscussionChannel: getActiveDiscussionChannel(pubData, locationData),
			activeThreadNumber: activeThreadNumber,
			discussionHandlers: this.getDiscussionHandlers(),
			discussionNodeOptionsPartial: this.getDiscussionNodeOptions(),
			initialDiscussionContent: initialDiscussionContent,
			locationData: locationData,
			threads: getThreads(pubData, locationData),
		});
	}
}

PubDiscussionsManager.propTypes = propTypes;
