import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { withRouter, Link } from 'react-router-dom';
import { Button, NonIdealState } from '@blueprintjs/core';
import { createPub } from 'actions/pubCreate';

require('./pubCreate.scss');

const propTypes = {
	appData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	pubCreateData: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
};

class PubCreate extends Component {
	constructor(props) {
		super(props);
		this.handleCreatePub = this.handleCreatePub.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (!this.props.pubCreateData.data && nextProps.pubCreateData.data) {
			this.props.history.push(`/pub/${nextProps.pubCreateData.data.newPubSlug}/collaborate`);
		}
	}

	handleCreatePub(collectionId) {
		this.props.dispatch(createPub(collectionId, this.props.appData.data.id));
	}
	render() {
		const collections = this.props.appData.data.collections.filter((item)=> {
			const isOpen = item.isOpenSubmissions && item.isPublic;
			const isAdmin = this.props.loginData.data.isAdmin;
			return !item.isPage && (isOpen || isAdmin);
		});

		if (!this.props.loginData.data.id) {
			return (
				<div className={'non-ideal-wrapper'}>
					<NonIdealState
						title={'Not Logged In'}
						visual={'pt-icon-issue'}
						description={'You must be logged in to create a Pub.'}
						action={<Link to={'/login?redirect=/pub/create'} className={'pt-button'}>Login</Link>}
					/>
				</div>
			);
		}

		if (!collections.length) {
			return (
				<div className={'non-ideal-wrapper'}>
					<NonIdealState
						title={'No Open Collections'}
						visual={'pt-icon-issue'}
						description={'This community does not have any Collections with open submissions at the moment.'}
					/>
				</div>
			);
		}

		return (
			<div className={'pub-create'}>
				<Helmet>
					<title>Create Pub</title>
				</Helmet>
				<div className={'container small'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<h1>Create Pub</h1>
							<p>Select a Collection to create your Pub in.</p>
						</div>
						{collections.map((item)=> {
							return (
								<div key={item.id} className={'col-12'}>
									<Button
										className={'pt-fill pt-large'}
										text={item.title}
										iconName={!item.isPublic ? 'lock2' : ''}
										loading={this.props.pubCreateData.isLoading === item.id}
										onClick={()=> { this.handleCreatePub(item.id); }}
									/>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

PubCreate.propTypes = propTypes;
export default withRouter(connect(state => ({
	appData: state.app,
	loginData: state.login,
	pubCreateData: state.pubCreate,
}))(PubCreate));
