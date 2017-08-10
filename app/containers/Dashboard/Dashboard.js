import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import DashboardSide from 'components/DashboardSide/DashboardSide';

require('./dashboard.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
};

class Dashboard extends Component {
	componentWillMount() {
		// Check that it's a valid page slug
		// If it's not - show 404
		// Grab the data for the page
	}

	render() {
		const pages = this.props.appData.collections.filter((item)=> {
			return item.isPage;
		});
		const collections = this.props.appData.collections.filter((item)=> {
			return !item.isPage;
		});

		const activeSlug = this.props.match.params.slug || '';
		const activeItem = this.props.appData.collections.reduce((prev, curr)=> {
			if (activeSlug === curr.slug) { return curr; }
			return prev;
		}, {});

		// Don't let people name pages with slug team/activity/site.
		if (activeSlug === 'activity') { activeItem.title = 'Activity'; }
		if (activeSlug === 'team') { activeItem.title = 'Team'; }
		if (activeSlug === 'site') { activeItem.title = 'Site'; }

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
								<h1>{activeItem.title}</h1>
								{(() => {
									switch (activeSlug) {
									case 'activity':
										// Return activity component
										return <div>activity</div>;
									case 'team':
										// Return team component
										return <div>team</div>;
									case 'site':
										// Return site component
										return <div>site</div>;
									default:
										// Return collection component
										return (
											<div>
												<button type={'button'} style={{ float: 'right' }} className={'pt-button pt-intent-primary'}>Save Changes</button>
												<div className="pt-button-group">
													<button type="button" className="pt-button pt-icon-globe pt-active">Public</button>
													<button type="button" className="pt-button pt-icon-lock">Private</button>
												</div>
												<div className="pt-button-group">
													<button type="button" className="pt-button pt-icon-add-to-artifact pt-active">Open</button>
													<button type="button" className="pt-button pt-icon-delete">Closed</button>
												</div>
											</div>
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
export default withRouter(connect(state => ({ appData: state.app }))(Dashboard));
