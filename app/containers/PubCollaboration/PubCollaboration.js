import React, { Component } from 'react';

import DiscussionPreview from 'components/DiscussionPreview/DiscussionPreview';
import DiscussionThread from 'components/DiscussionThread/DiscussionThread';
import { Editor } from '@pubpub/editor';
import FormattingMenu from '@pubpub/editor/addons/FormattingMenu';
import Collaborative from '@pubpub/editor/addons/Collaborative';

import Helmet from 'react-helmet';
import Overlay from 'components/Overlay/Overlay';
import PropTypes from 'prop-types';
import PubCollabHeader from 'components/PubCollabHeader/PubCollabHeader';
import PubCollabShare from 'components/PubCollabShare/PubCollabShare';
import { connect } from 'react-redux';
import { getPubData } from 'actions/pub';
import { nestDiscussionsToThreads } from 'utilities';
// import { pubBody } from '../../../stories/_data';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';

require('./pubCollaboration.scss');
require('components/PubBody/pubBody.scss');
// require('@pubpub/editor/style/base.scss');
// require('@pubpub/editor/style/fonts.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
};

class PubCollaboration extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isPublishOpen: false,
			isShareOpen: false,
			isMetadataOpen: false,
			isAuthorsOpen: false,
		};
		this.togglePublish = this.togglePublish.bind(this);
		this.toggleShare = this.toggleShare.bind(this);
		this.toggleMetadata = this.toggleMetadata.bind(this);
		this.toggleAuthors = this.toggleAuthors.bind(this);
		this.handleReplySubmit = this.handleReplySubmit.bind(this);
	}
	componentWillMount() {
		this.props.dispatch(getPubData(this.props.match.params.slug));
	}

	togglePublish() {
		this.setState({ isPublishOpen: !this.state.isPublishOpen });
	}
	toggleShare() {
		this.setState({ isShareOpen: !this.state.isShareOpen });
	}
	toggleMetadata() {
		this.setState({ isMetadataOpen: !this.state.isMetadataOpen });
	}
	toggleAuthors() {
		this.setState({ isAuthorsOpen: !this.state.isAuthorsOpen });
	}

	handleReplySubmit(content) {
		console.log(content);
	}

	render() {
		const queryObject = queryString.parse(this.props.location.search);

		const pubData = this.props.pubData.data || {};
		const discussions = pubData.discussions || [];
		const threads = nestDiscussionsToThreads(discussions);

		const activeThread = threads.reduce((prev, curr)=> {
			if (curr[0].threadNumber === Number(queryObject.thread)) { return curr; }
			return prev;
		}, undefined);

		if (!pubData.id) { return <p>Loading</p>; }

		const firebaseConfig = {
			apiKey: 'AIzaSyBpE1sz_-JqtcIm2P4bw4aoMEzwGITfk0U',
			authDomain: 'pubpub-rich.firebaseapp.com',
			databaseURL: 'https://pubpub-rich.firebaseio.com',
			projectId: 'pubpub-rich',
			storageBucket: 'pubpub-rich.appspot.com',
			messagingSenderId: '543714905893',
		};
		return (
			<div className={'pub-collaboration'}>

				<Helmet>
					<title>Edit</title>
				</Helmet>

				<div className={'upper'}>
					<div className={'container'}>
						<div className={'row'}>
							<div className={'col-12'}>
								<PubCollabHeader
									pubData={pubData}
									collaborators={pubData.contributors}
									activeCollaborators={[
										pubData.contributors[0],
										pubData.contributors[1],
										pubData.contributors[2]
									]}
									onPublishClick={this.togglePublish}
									onShareClick={this.toggleShare}
									onMetadataClick={this.toggleMetadata}
									onAuthorsClick={this.toggleAuthors}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className={'lower'}>
					<div className={'container'}>
						<div className={'row'}>
							<div className={'col-12'}>

								<div className={'side-panel'}>
									<div className={'side-panel-content'}>
										{activeThread
											? <DiscussionThread
												discussions={activeThread}
												slug={pubData.slug}
												loginData={this.props.loginData.data}
												pathname={`${this.props.location.pathname}${this.props.location.search}`}
												handleReplySubmit={this.handleReplySubmit}
											/>
											: threads.map((thread)=> {
												return (
													<DiscussionPreview
														key={`thread-${thread[0].id}`}
														discussions={thread}
														slug={pubData.slug}
														isPresentation={false}
													/>
												);
											})
										}
									</div>
								</div>

								<div className={'content-panel'}>
									<div className={'pub-body'}>
										{/* pubBody */}
										<Editor placeholder={'Begin writing here'}>
											<FormattingMenu />
											<Collaborative
												// ref={(collab) => { this.collab = collab; }}
												firebaseConfig={{
													apiKey: 'AIzaSyBpE1sz_-JqtcIm2P4bw4aoMEzwGITfk0U',
													authDomain: 'pubpub-rich.firebaseapp.com',
													databaseURL: 'https://pubpub-rich.firebaseio.com',
													projectId: 'pubpub-rich',
													storageBucket: 'pubpub-rich.appspot.com',
													messagingSenderId: '543714905893',
												}}
												clientID={`doc-test-clientid-${Math.ceil(Math.random() * 25000)}`}
												editorKey={'doc-test-editorkey'}
											/>
										</Editor>
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>

				<Overlay isOpen={this.state.isPublishOpen} onClose={this.togglePublish}>
					<h5>Publish Snapshot</h5>
					<button type={'button'} className={'pt-button pt-intent-primary'}>Publish Snapshot</button>
				</Overlay>
				<Overlay isOpen={this.state.isShareOpen} onClose={this.toggleShare}>
					<PubCollabShare />
				</Overlay>
				<Overlay isOpen={this.state.isAuthorsOpen} onClose={this.toggleAuthors}>
					<h5>Authors</h5>
				</Overlay>
				<Overlay isOpen={this.state.isMetadataOpen} onClose={this.toggleMetadata}>
					<h5>Metadata</h5>
				</Overlay>
			</div>
		);
	}
}

PubCollaboration.propTypes = propTypes;
export default withRouter(connect(state => ({
	pubData: state.pub,
	loginData: state.login,
}))(PubCollaboration));
