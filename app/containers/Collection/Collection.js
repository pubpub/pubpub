import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button, NonIdealState } from '@blueprintjs/core';
import PubPreview from 'components/PubPreview/PubPreview';
import PubPreviewLoading from 'components/PubPreview/PubPreviewLoading';
import Footer from 'components/Footer/Footer';
import NoMatch from 'containers/NoMatch/NoMatch';
import { getCollectionData } from 'actions/collection';
import { createPub } from 'actions/pubCreate';

require('./collection.scss');

const propTypes = {
	match: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	pubCreateData: PropTypes.object.isRequired,
	collectionData: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
};

class Collection extends Component {
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
				this.props.dispatch(getCollectionData(collectionId, communityId));
			}
		}
	}

	handleCreatePub() {
		const communityId = this.props.appData.data.id;
		const collectionId = this.props.collectionData.data.id;
		this.props.dispatch(createPub(collectionId, communityId));
	}

	render() {
		const collectionData = this.props.collectionData.data || { pubs: [] };
		const title = this.props.appData.data.collections.reduce((prev, curr)=> {
			if (curr.slug === '' && this.props.match.params.slug === undefined) { return curr.title; }
			if (curr.slug === this.props.match.params.slug) { return curr.title; }
			return prev;
		}, undefined);

		if (!title) { return <NoMatch />; }
		const numPublished = collectionData.pubs.reduce((prev, curr)=> {
			if (curr.isPublished) { return prev + 1; }
			return prev;
		}, 0);
		return (
			<div>
				<div className={'collection'}>
					<Helmet>
						{title !== 'Home' &&
							<title>{title}</title>
						}
					</Helmet>

					<div className={'container'}>
						<div className={'row'}>
							<div className={'col-12'}>
								{!collectionData.isPage && collectionData.isOpenSubmissions &&
									<Button
										type={'button'}
										className={'pt-button pt-intent-primary create-pub-button'}
										loading={this.props.pubCreateData.isLoading}
										onClick={this.handleCreatePub}
										text={'Create Pub in Collection'}
									/>
								}
								{collectionData.slug &&
									<h1>{title}</h1>
								}
								<p className={'description'}>{collectionData.description}</p>
							</div>
						</div>

						{collectionData.layout && collectionData.layout.html &&
							<div className={'row'}>
								<div className={'col-12'}>
									<div dangerouslySetInnerHTML={{ __html: collectionData.layout.html }} />
								</div>
							</div>
						}

						{!collectionData.id &&
							<div className={'row'}>
								<div className={'col-12'}>
									<PubPreviewLoading />
									<PubPreviewLoading />
									<PubPreviewLoading />
								</div>
							</div>
						}
						{!!collectionData.id &&
							<div>
								{collectionData.pubs.filter((item)=> {
									return item.isPublished;
								}).map((pub, index)=> {
									return (
										<div className={'row'} key={`pub-${pub.id}`}>
											<div className={'col-12'}>
												<PubPreview
													title={pub.title}
													description={pub.description}
													slug={pub.slug}
													bannerImage={pub.avatar}
													isLarge={[0, 3, 6, 8].indexOf(index) > -1}
													publicationDate={pub.updatedAt}
													collaborators={pub.collaborators.filter((item)=> {
														return !item.Collaborator.isAuthor;
													})}
													authors={pub.collaborators.filter((item)=> {
														return item.Collaborator.isAuthor;
													})}
												/>
											</div>
										</div>
									);
								})}
							</div>
						}
						{!!collectionData.id && !numPublished && !collectionData.isPage &&
							<NonIdealState
								title={'Empty Collection'}
								description={'This collection has no published Pubs.'}
								visual={'pt-icon-applications'}
							/>
						}
					</div>
				</div>

				{!this.props.collectionData.isLoading &&
					<Footer isAdmin={this.props.loginData.data.isAdmin} />
				}

			</div>
		);
	}
}

Collection.propTypes = propTypes;
export default withRouter(connect(state => ({
	appData: state.app,
	loginData: state.login,
	pubCreateData: state.pubCreate,
	collectionData: state.collection,
}))(Collection));
