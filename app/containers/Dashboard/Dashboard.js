import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import DashboardSide from 'components/DashboardSide/DashboardSide';
import DashboardCollection from 'components/DashboardCollection/DashboardCollection';
import DashboardCollectionEdit from 'components/DashboardCollectionEdit/DashboardCollectionEdit';
import DashboardSite from 'components/DashboardSite/DashboardSite';
import { getCollectionData } from 'actions/collection';
import { putAppData } from 'actions/app';
import { createPub } from 'actions/pubCreate';

require('./dashboard.scss');

const propTypes = {
	location: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
	collectionData: PropTypes.object.isRequired,
	pubCreateData: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
};

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.handleCreatePub = this.handleCreatePub.bind(this);
		this.handleSiteSave = this.handleSiteSave.bind(this);
	}
	componentWillMount() {
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
				this.props.dispatch(getCollectionData(collectionId));
			}
		}
	}

	handleCreatePub(collectionId) {
		const communityId = this.props.appData.data.id;
		this.props.dispatch(createPub(collectionId, communityId));
	}
	handleSiteSave(siteObject) {
		this.props.dispatch(putAppData(siteObject));
	}

	render() {
		const appData = this.props.appData.data || {};
		const collectionData = this.props.collectionData.data || {};
		const queryObject = queryString.parse(this.props.location.search);
		const pages = appData.collections.filter((item)=> {
			return item.isPage;
		});
		const collections = appData.collections.filter((item)=> {
			return !item.isPage;
		});

		const activeSlug = this.props.match.params.slug || '';
		const activeMode = this.props.match.params.mode || '';
		const activeItem = appData.collections.reduce((prev, curr)=> {
			if (activeSlug === curr.slug) { return curr; }
			return prev;
		}, {});

		// Don't let people name pages with slug team/activity/site.
		if (activeSlug === 'activity') { activeItem.title = 'Activity'; }
		if (activeSlug === 'team') { activeItem.title = 'Team'; }
		if (activeSlug === 'site') { activeItem.title = 'Site'; }
		collectionData.title = activeItem.title;
		return (
			<div className={'dashboard'}>

				<Helmet>
					<title>{activeItem.title} · Dashboard</title>
				</Helmet>

				<div className={'container'}>
					<div className={'row'}>
						<div className={'col-12'}>

							<div className={'side-panel'}>
								<DashboardSide pages={pages} collections={collections} activeSlug={activeSlug} />
							</div>

							<div className={'content-panel'}>
								{(() => {
									switch (activeSlug) {
									case 'activity':
										// Return activity component
										return (
											<div>
												<h1 className={'content-title'}>{activeItem.title}</h1>
												<div>activity</div>
											</div>
										);
									case 'team':
										// Return team component
										return (
											<div>
												<h1 className={'content-title'}>{activeItem.title}</h1>
												<div>team</div>
											</div>
										);
									case 'site':
										return (
											<DashboardSite
												appData={appData}
												onSave={this.handleSiteSave}
												isLoading={this.props.appData.putIsLoading}
												error={this.props.appData.putError}
											/>
										);
									default:
										if (activeMode === 'edit') {
											return <DashboardCollectionEdit collectionData={collectionData} />;
										}
										return (
											<DashboardCollection
												collectionData={collectionData}
												sortMode={queryObject.sort}
												isSortReverse={queryObject.direction === 'reverse'}
												onCreatePub={this.handleCreatePub}
												createPubLoading={this.props.pubCreateData.isLoading}
											/>
										);
									}
								})()}
							</div>

						</div>
					</div>
				</div>
			</div>
		);
	}
}

Dashboard.propTypes = propTypes;
export default withRouter(connect(state => ({
	appData: state.app,
	collectionData: state.collection,
	pubCreateData: state.pubCreate,
}))(Dashboard));
