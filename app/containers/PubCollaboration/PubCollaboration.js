import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import PubCollabHeader from 'components/PubCollabHeader/PubCollabHeader';
import PubCollabShare from 'components/PubCollabShare/PubCollabShare';
import DiscussionPreviewPanel from 'components/DiscussionPreviewPanel/DiscussionPreviewPanel';
import DiscussionThread from 'components/DiscussionThread/DiscussionThread';
import Overlay from 'components/Overlay/Overlay';

import { Editor } from '@pubpub/editor';
import { Autocomplete, CollaborativeAddon, FormattingMenu, InsertMenu, TableMenu } from '@pubpub/editor/addons';

import { getPubData } from 'actions/pub';
import { nestDiscussionsToThreads } from 'utilities';
import { pubBody } from '../../../stories/_data';

require('./pubCollaboration.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
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
											? <DiscussionThread discussions={activeThread} slug={pubData.slug} />
											: <DiscussionPreviewPanel threads={threads} slug={pubData.slug} />
										}
									</div>
								</div>

								<div className={'content-panel'}>
									{/*<div className={'pub-body'} contentEditable="true">*/}
									<div className={'pub-body'}>
										{/* pubBody */}
										<Editor ref={(editor) => { this.editor = editor; }} mode={'rich'}>
											{/* <Autocomplete
												onSelection={this.onMentionSelection}
												localUsers={this.props.localUsers}
												localPubs={this.props.localPubs}
												localFiles={this.props.localFiles}
												localReferences={this.props.localReferences}
												localHighlights={this.props.localHighlights}
												localPages={this.props.localPages}
												globalCategories={['pubs', 'users']} 
											/> */}
											<InsertMenu
												allReferences={[]}
												handleFileUpload={()=>{}}
												handleReferenceAdd={()=>{}}
											/>
											<TableMenu />
											<FormattingMenu />
											{/* What happens if a collaborative= plugin is removed? */}
											<CollaborativeAddon
												ref={(collab) => { this.collab = collab; }}
												firebaseConfig={firebaseConfig}
												// clientID={this.props.clientID}
												// editorKey={this.props.editorKey}
												clientID={'travis-test-clientid'}
												editorKey={'travis-test-editorkey'}
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
export default withRouter(connect(state => ({ pubData: state.pub }))(PubCollaboration));
