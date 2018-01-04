import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, NonIdealState } from '@blueprintjs/core';
import { Editor } from '@pubpub/editor';
import Image from '@pubpub/editor/addons/Image';
import Video from '@pubpub/editor/addons/Video';
import File from '@pubpub/editor/addons/File';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper, apiFetch, getResizedUrl } from 'utilities';

require('./collectionSubmit.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	collectionData: PropTypes.object.isRequired,
};

class CollectionSubmit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			createPubIsLoading: false,
		};
		this.handleCreatePub = this.handleCreatePub.bind(this);
	}

	handleCreatePub() {
		this.setState({ createPubIsLoading: true });
		return apiFetch('/api/pubs', {
			method: 'POST',
			body: JSON.stringify({
				collectionId: this.props.collectionData.id,
				communityId: this.props.communityData.id,
				createPubHash: this.props.locationData.params.hash,
			})
		})
		.then((result)=> {
			// this.setState({ createPubIsLoading: false });
			window.location.href = result;
		})
		.catch((err)=> {
			console.error(err);
			this.setState({ createPubIsLoading: false });
		});
	}

	render() {
		const collectionData = this.props.collectionData;
		const validHash = this.props.locationData.params.hash && this.props.locationData.params.hash === collectionData.createPubHash;
		const isOpenSubmissions = collectionData.isOpenSubmissions;
		const isCommunityAdmin = this.props.loginData.isAdmin;
		const canSubmit = validHash || isOpenSubmissions || isCommunityAdmin;

		return (
			<div id="collection-submit-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
				>
					{!canSubmit &&
						<div className="non-ideal-wrapper">
							<NonIdealState
								title="Submissions Not Allowed"
								description="Public submissions are not allowed in this collection."
								visual="pt-icon-applications"
							/>
						</div>
					}
					{canSubmit &&
						<div className="container narrow">
							<div className="row">
								<div className="col-12">
									<h1>Create Pub in {collectionData.title || 'Home'}</h1>

									{!collectionData.createPubMessage &&
										<div className="message">
											<p>Click the button below to create a pub in this collection</p>
											<p>You will have the chance to edit, discuss, share, and review before publishing your work.</p>
										</div>
									}

									{collectionData.createPubMessage &&
										<div className="message">
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
									<div className="button-wrapper">
										{this.props.loginData.id &&
											<Button
												className="pt-large pt-intent-primary"
												text="Create Pub"
												iconName={!collectionData.isPublic ? 'lock2' : ''}
												loading={this.state.createPubIsLoading}
												onClick={this.handleCreatePub}
											/>
										}
										{!this.props.loginData.id &&
											<a
												href={`/login?redirect=${this.props.locationData.path}`}
												className="pt-large pt-button pt-intent-primary"
											>
												Login to Create Pub
											</a>
										}
									</div>

								</div>
							</div>
						</div>
					}
				</PageWrapper>
			</div>
		);
	}
}

CollectionSubmit.propTypes = propTypes;
export default CollectionSubmit;

hydrateWrapper(CollectionSubmit);
