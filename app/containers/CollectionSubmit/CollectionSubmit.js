import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { Button, NonIdealState } from '@blueprintjs/core';
import { Editor } from '@pubpub/editor';
import Image from '@pubpub/editor/addons/Image';
import Video from '@pubpub/editor/addons/Video';
import File from '@pubpub/editor/addons/File';
import NoMatch from 'containers/NoMatch/NoMatch';
import { getCollectionData } from 'actions/collection';
import { createPub } from 'actions/pubCreate';
import { getResizedUrl } from 'utilities';

require('./collectionSubmit.scss');

const propTypes = {
	appData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	pubCreateData: PropTypes.object.isRequired,
	collectionData: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
};

class CollectionSubmit extends Component {
	constructor(props) {
		super(props);
		this.handleCreatePub = this.handleCreatePub.bind(this);
	}
	componentWillMount() {
		// console.log(this.props.appData.data.id);
		this.dispatchGetCollectionData(this.props);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.slug !== this.props.match.params.slug) {
			this.dispatchGetCollectionData(nextProps);
		}
		if (!this.props.pubCreateData.data && nextProps.pubCreateData.data) {
			this.props.history.push(`/pub/${nextProps.pubCreateData.data.newPubSlug}/collaborate`);
		}
	}

	dispatchGetCollectionData(props) {
		// Currently, this has to wait until appData has been fetched and loaded before
		// even sending off the request. If we find this is slow, we can try sending
		// the slug (available from url immediately) to the API, and use the origin
		// to do a Community query to identify which communityId we need to restrict
		// by. This is all because collection slugs are not unique.
		if (props.appData.data) {
			const collectionId = props.appData.data.collections.reduce((prev, curr)=> {
				if (curr.slug === '' && props.match.params.slug === undefined) { return curr.id; }
				if (curr.slug === props.match.params.slug) { return curr.id; }
				return prev;
			}, undefined);
			if (collectionId) {
				const communityId = props.appData.data.id;
				this.props.dispatch(getCollectionData(collectionId, communityId, this.props.match.params.hash));
			}
		}
	}

	handleCreatePub() {
		const communityId = this.props.appData.data.id;
		const collectionId = this.props.collectionData.data.id;
		this.props.dispatch(createPub(collectionId, communityId, this.props.match.params.hash));
	}
	render() {
		const collectionData = this.props.collectionData.data || { pubs: [] };
		const title = this.props.appData.data.collections.reduce((prev, curr)=> {
			if (curr.slug === '' && this.props.match.params.slug === undefined) { return curr.title; }
			if (curr.slug === this.props.match.params.slug) { return curr.title; }
			return prev;
		}, undefined);
		const validHash = this.props.match.params.hash && this.props.match.params.hash === collectionData.createPubHash;
		const isOpenSubmissions = collectionData.isOpenSubmissions;
		const isCommunityAdmin = this.props.loginData.data.isAdmin;
		if (this.props.collectionData.isLoading) { return null; }
		if (!collectionData.id || collectionData.isPage) { return <NoMatch />; }

		if (!validHash && !isOpenSubmissions && !isCommunityAdmin) {
			return (
				<div className={'non-ideal-wrapper'}>
					<NonIdealState
						title={'Submissions Not Allowed'}
						description={'Public submissions are not allowed in this collection.'}
						visual={'pt-icon-applications'}
					/>
				</div>
			);
		}


		return (
			<div className={'collection-submit'}>
				<Helmet>
					<title>{title || 'Home'} Submit</title>
				</Helmet>
				<div className={'container narrow'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<h1>Create Pub in {title || 'Home'}</h1>

							{!collectionData.createPubMessage &&
								<div className={'message'}>
									<p>Click the button below to create a pub in this collection</p>
									<p>You will have the chance to edit, discuss, share, and review before publishing your work.</p>
								</div>
							}

							{collectionData.createPubMessage &&
								<div className={'message'}>
									<Editor
										initialContent={collectionData.createPubMessage || undefined}
										isReadOnly={true}
									>
										<Image
											handleResizeUrl={(url)=> { return getResizedUrl(url, 'fit-in', '800x0'); }}
										/>
										<Video />
										<File />
									</Editor>
								</div>
							}
							<div className={'button-wrapper'}>
								<Button
									className={'pt-large pt-intent-primary'}
									text={'Create Pub'}
									iconName={!collectionData.isPublic ? 'lock2' : ''}
									loading={this.props.pubCreateData.isLoading === collectionData.id}
									onClick={this.handleCreatePub}
								/>
							</div>

						</div>
					</div>
				</div>
			</div>
		);
	}
}

CollectionSubmit.propTypes = propTypes;
export default withRouter(connect(state => ({
	appData: state.app,
	loginData: state.login,
	pubCreateData: state.pubCreate,
	collectionData: state.collection,
}))(CollectionSubmit));
