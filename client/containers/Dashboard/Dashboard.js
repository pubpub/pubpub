import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import Helmet from 'react-helmet';
// import queryString from 'query-string';
import PropTypes from 'prop-types';
// import { withRouter } from 'react-router-dom';
// import NoMatch from 'containers/NoMatch/NoMatch';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import DashboardSide from 'components/DashboardSide/DashboardSide';
import DashboardCollection from 'components/DashboardCollection/DashboardCollection';
import DashboardCollectionEdit from 'components/DashboardCollectionEdit/DashboardCollectionEdit';
// import DashboardCollectionLoading from 'components/DashboardCollection/DashboardCollectionLoading';
import DashboardCreateCollection from 'components/DashboardCreateCollection/DashboardCreateCollection';
import DashboardSite from 'components/DashboardSite/DashboardSite';
import DashboardTeam from 'components/DashboardTeam/DashboardTeam';
// import { getCollectionData, postCollection, putCollection, deleteCollection } from 'actions/collection';
// import { putAppData, postCommunityAdmin, deleteCommunityAdmin } from 'actions/app';
// import { createPub } from 'actions/pubCreate';

import { hydrateWrapper, apiFetch } from 'utilities';

require('./dashboard.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	collectionData: PropTypes.object.isRequired,

	// location: PropTypes.object.isRequired,
	// match: PropTypes.object.isRequired,
	// appData: PropTypes.object.isRequired,
	// loginData: PropTypes.object.isRequired,
	// collectionData: PropTypes.object.isRequired,
	// pubCreateData: PropTypes.object.isRequired,
	// history: PropTypes.object.isRequired,
	// dispatch: PropTypes.func.isRequired,
};

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			putCommunityIsLoading: false,
			putCommunityError: undefined,
			postCollectionIsLoading: false,
			postCollectionError: undefined,
			putCollectionIsLoading: false,
			deleteCollectionIsLoading: false,
			putCollectionError: undefined,
			postPubIsLoading: false,
		};
		this.handleCreatePub = this.handleCreatePub.bind(this);
		this.handleSiteSave = this.handleSiteSave.bind(this);
		this.handleCollectionCreate = this.handleCollectionCreate.bind(this);
		this.handleCollectionSave = this.handleCollectionSave.bind(this);
		this.handleCollectionDelete = this.handleCollectionDelete.bind(this);
		this.handleAddAdmin = this.handleAddAdmin.bind(this);
		this.handleRemoveAdmin = this.handleRemoveAdmin.bind(this);
		// this.updatePath = this.updatePath.bind(this);
	}
	// componentWillMount() {
	// 	this.dispatchGetCollectionData(this.props);
	// }
	componentWillReceiveProps(nextProps) {
		// if (nextProps.match.params.slug !== this.props.match.params.slug) {
		// 	if (nextProps.collectionData.data && nextProps.match.params.slug !== nextProps.collectionData.data.slug) {
		// 		this.dispatchGetCollectionData(nextProps);
		// 	}
		// }
		// if (!this.props.pubCreateData.data && nextProps.pubCreateData.data) {
		// 	this.props.history.push(`/pub/${nextProps.pubCreateData.data.newPubSlug}/collaborate`);
		// }
		// if (this.props.appData.data && this.props.appData.data.subdomain !== nextProps.appData.data.subdomain) {
		// 	window.location.href = window.location.href.replace(this.props.appData.data.subdomain, nextProps.appData.data.subdomain);
		// }
		// if (this.props.appData.putCollectionIsLoading && !nextProps.appData.putCollectionIsLoading) {
		// 	const oldSlug = this.props.match.params.slug;
		// 	const newSlug = nextProps.collectionData.data.slug;
		// 	this.props.history.push(`${nextProps.location.pathname.replace(`/dashboard/${oldSlug}`, `/dashboard/${newSlug}`).replace(/\/edit$/, '')}${nextProps.location.search}`);
		// }
		// if (this.props.appData.deleteCollectionIsLoading && !nextProps.appData.deleteCollectionIsLoading) {
		// 	this.props.history.push('/dashboard');
		// }
	}

	// dispatchGetCollectionData(props) {
	// 	// Currently, this has to wait until appData has been fetched and loaded before
	// 	// even sending off the request. If we find this is slow, we can try sending
	// 	// the slug (available from url immediately) to the API, and use the origin
	// 	// to do a Community query to identify which communityId we need to restrict
	// 	// by. This is all because collection slugs are not unique.
	// 	if (props.appData.data && props.loginData.data.isAdmin) {
	// 		const collectionId = props.appData.data.collections.reduce((prev, curr)=> {
	// 			if (curr.slug === '' && props.match.params.slug === undefined) { return curr.id; }
	// 			if (curr.slug === '' && props.match.params.slug === 'home') { return curr.id; }
	// 			if (curr.slug === props.match.params.slug) { return curr.id; }
	// 			return prev;
	// 		}, undefined);
	// 		if (collectionId) {
	// 			const communityId = props.appData.data.id;
	// 			this.props.dispatch(getCollectionData(collectionId, communityId));
	// 		}
	// 	}
	// }

	handleCreatePub(collectionId) {
		// const communityId = this.props.appData.data.id;
		// this.props.dispatch(createPub(collectionId, communityId));
		this.setState({ postPubIsLoading: true });
		return apiFetch('/pubs', {
			method: 'POST',
			body: JSON.stringify({
				collectionId: collectionId,
				communityId: this.props.communityData.id,
				createPubHash: undefined,
			})
		})
		.then((result)=> {
			// this.setState({ postPubIsLoading: false });
			window.location.href = result;
		})
		.catch((err)=> {
			console.error(err);
			this.setState({ postPubIsLoading: false });
		});
	}
	handleSiteSave(siteObject) {
		// this.props.dispatch(putAppData(siteObject));
		this.setState({ putCommunityIsLoading: true, putCommunityError: undefined });
		return apiFetch('/communities', {
			method: 'PUT',
			body: JSON.stringify(siteObject)
		})
		.then(()=> {
			// this.setState({ putCommunityIsLoading: false, putCommunityError: undefined });
			if (!this.props.communityData.domain) {
				window.location.replace(`https://${siteObject.subdomain}.pubpub.org/dashboard/site`);
			} else {
				window.location.reload();
			}
		})
		.catch((err)=> {
			console.error(err);
			this.setState({ putCommunityIsLoading: false, putCommunityError: err });
		});
	}
	handleCollectionCreate(collectionObject) {
		console.log('Create collection');
		// const communityId = this.props.appData.data.id;
		// this.props.dispatch(postCollection({
		// 	...collectionObject,
		// 	communityId: communityId,
		// }));

		this.setState({ postCollectionIsLoading: true, postCollectionError: undefined });
		return apiFetch('/collections', {
			method: 'POST',
			body: JSON.stringify({
				...collectionObject,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			// this.setState({ postCollectionIsLoading: false, postCollectionError: undefined });
			window.location.href = `/dashboard/${collectionObject.slug}`;
		})
		.catch((err)=> {
			console.error(err);
			this.setState({ postCollectionIsLoading: false, postCollectionError: err });
		});
	}
	handleCollectionSave(collectionObject) {
		console.log('save collection');
		// const communityId = this.props.appData.data.id;
		// this.props.dispatch(putCollection({
		// 	...collectionObject,
		// 	communityId: communityId,
		// }));
		this.setState({ putCollectionIsLoading: true, putCollectionError: undefined });
		return apiFetch('/collections', {
			method: 'PUT',
			body: JSON.stringify({
				...collectionObject,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			// this.setState({ putCollectionIsLoading: false, putCollectionError: undefined });
			window.location.href = `/dashboard/${collectionObject.slug}`;
		})
		.catch((err)=> {
			console.error(err);
			this.setState({ putCollectionIsLoading: false, putCollectionError: err });
		});
	}
	handleCollectionDelete(collectionId) {
		console.log('delete coll');
		// const communityId = this.props.appData.data.id;
		// this.props.dispatch(deleteCollection({
		// 	collectionId: collectionId,
		// 	communityId: communityId,
		// }));
		this.setState({ deleteCollectionIsLoading: true });
		return apiFetch('/collections', {
			method: 'DELETE',
			body: JSON.stringify({
				collectionId: collectionId,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			// this.setState({ deleteCollectionIsLoading: false });
			window.location.href = '/dashboard';
		})
		.catch((err)=> {
			console.error(err);
			this.setState({ deleteCollectionIsLoading: false });
		});
	}
	handleAddAdmin(adminObject) {
		console.log('add admin');
		// this.props.dispatch(postCommunityAdmin(adminObject));
		// this.setState({ postCommunityAdmin: true, postcom: undefined });
		return apiFetch('/communityAdmins', {
			method: 'POST',
			body: JSON.stringify(adminObject)
		})
		.then(()=> {
			// this.setState({ postCommunityAdmin: false, postcom: undefined });
			window.location.reload();
		});
		// .catch((err)=> {
			// console.error(err);
			// this.setState({ postCommunityAdmin: false, postcom: err });
		// });
	}
	handleRemoveAdmin(adminObject) {
		console.log('del admin');
		// this.props.dispatch(deleteCommunityAdmin(adminObject));
		return apiFetch('/communityAdmins', {
			method: 'DELETE',
			body: JSON.stringify(adminObject)
		})
		.then(()=> {
			// this.setState({ postCommunityAdmin: false, postcom: undefined });
			window.location.reload();
		});
	}
	// updatePath(updatedPath) {
	// 	this.props.history.push(updatedPath);
	// }

	render() {
		// if (!this.props.loginData.data.isAdmin) { return <NoMatch />; }

		// const appData = this.props.appData.data || {};
		const communityData = this.props.communityData;
		const collectionData = this.props.collectionData;
		// const collectionData = this.props.collectionData.data || {};
		// const queryObject = queryString.parse(this.props.location.search);
		const pages = communityData.collections.filter((item)=> {
			return item.isPage;
		});
		const collections = communityData.collections.filter((item)=> {
			return !item.isPage;
		});

		const activeSlug = this.props.locationData.params.slug || '';
		const activeMode = this.props.locationData.params.mode || '';
		// const activeItem = communityData.collections.reduce((prev, curr)=> {
		// 	if (activeSlug === curr.slug) { return curr; }
		// 	if (activeSlug === 'home' && !curr.slug) { return curr; }
		// 	return prev;
		// }, {});

		// TODO: Don't let people name pages with slug team/activity/site.
		// if (activeSlug === 'activity') { activeItem.title = 'Activity'; }
		// if (activeSlug === 'team') { activeItem.title = 'Team'; }
		// if (activeSlug === 'site') { activeItem.title = 'Site'; }
		// if (activeSlug === 'page') { activeItem.title = 'New Page'; }
		// if (activeSlug === 'collection') { activeItem.title = 'New Collection'; }
		// collectionData.title = activeItem.title;
		// collectionData.isPage = activeItem.isPage;
		// if (!activeItem.title) { activeItem.title = 'Not Found'; }
		return (
			<div id="dashboard-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
					fixHeader={true}
					hideNav={true}
					hideFooter={true}
				>
					{/*<Helmet>
						<title>{activeItem.title} · Dashboard</title>
						<meta name="robots" content="noindex,nofollow" />
					</Helmet>*/}

					<div className="container">
						<div className="row">
							<div className="col-12 no-margin">

								<div className="side-panel">
									<DashboardSide pages={pages} collections={collections} activeSlug={activeSlug} />
								</div>

								<div className="content-panel">
									{(()=> {
										switch (activeSlug) {
										case 'team':
											// Return team component
											return (
												<div>
													<DashboardTeam
														communityData={communityData}
														onAddAdmin={this.handleAddAdmin}
														onRemoveAdmin={this.handleRemoveAdmin}
													/>
												</div>
											);
										case 'site':
											return (
												<DashboardSite
													communityData={communityData}
													onSave={this.handleSiteSave}
													isLoading={this.state.putCommunityIsLoading}
													error={this.state.putCommunityError}
												/>
											);
										case 'page':
											if (activeMode === 'create') {
												return (
													<DashboardCreateCollection
														isPage={true}
														onCreate={this.handleCollectionCreate}
														isLoading={this.state.postCollectionIsLoading}
														error={this.state.postCollectionError}
														// updatePath={this.updatePath}
														hostname={this.props.locationData.hostname}
													/>
												);
											}
											break;
										case 'collection':
											if (activeMode === 'create') {
												return (
													<DashboardCreateCollection
														isPage={false}
														onCreate={this.handleCollectionCreate}
														isLoading={this.state.postCollectionIsLoading}
														error={this.state.postCollectionError}
														// updatePath={this.updatePath}
														hostname={this.props.locationData.hostname}
													/>
												);
											}
											break;
										default:
											if (activeMode === 'edit') {
												return (
													<DashboardCollectionEdit
														location={this.props.locationData}
														collectionData={collectionData}
														putIsLoading={this.state.putCollectionIsLoading}
														deleteIsLoading={this.state.deleteCollectionIsLoading}
														error={this.state.putCollectionError}
														onSave={this.handleCollectionSave}
														onDelete={this.handleCollectionDelete}
													/>
												);
											}
											return (
												<DashboardCollection
													collectionData={collectionData}
													onCreatePub={this.handleCreatePub}
													createPubLoading={this.state.postPubIsLoading}
													hostname={this.props.locationData.hostname}
												/>
											);
										}
									})()}
								</div>
							</div>
						</div>
					</div>
				</PageWrapper>
			</div>
		);
	}
}

Dashboard.propTypes = propTypes;
export default Dashboard;

hydrateWrapper(Dashboard);
