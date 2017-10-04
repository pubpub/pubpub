import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import { withRouter, Link } from 'react-router-dom';
import { NonIdealState } from '@blueprintjs/core';
import UserHeader from 'components/UserHeader/UserHeader';
import UserNav from 'components/UserNav/UserNav';
import UserEdit from 'components/UserEdit/UserEdit';
import PubPreview from 'components/PubPreview/PubPreview';
import { getUserData, putUserData } from 'actions/user';
import UserLoading from './UserLoading';

require('./user.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
	userData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
};

class User extends Component {
	constructor(props) {
		super(props);
		this.handleUserEditSave = this.handleUserEditSave.bind(this);
	}

	componentWillMount() {
		this.props.dispatch(getUserData(this.props.match.params.slug));
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.slug !== this.props.match.params.slug) {
			this.props.dispatch(getUserData(nextProps.match.params.slug));
		}
		if (this.props.userData.putUserIsLoading
			&& !nextProps.userData.putUserIsLoading
			&& !nextProps.userData.putUserError)
		{
			this.props.history.push(`/user/${nextProps.userData.data.slug}`);
		}
	}
	handleUserEditSave(userObject) {
		this.props.dispatch(putUserData(userObject));
	}
	render() {
		const userData = this.props.userData.data || {};
		const loginData = this.props.loginData.data || {};
		const selfProfile = loginData.id && userData.id === loginData.id;
		const mode = this.props.match.params.mode;
		const communityPubs = userData.pubs
			? userData.pubs.filter((pub)=> {
				return pub.communityId === this.props.appData.data.id;
			})
			: [];

		if (!userData.id) {
			return <UserLoading />;
		}
		if (mode === 'edit') {
			return (
				<UserEdit
					userData={userData}
					onSave={this.handleUserEditSave}
					error={this.props.userData.putUserError}
					isLoading={this.props.userData.putUserIsLoading}
				/>
			);
		}
		return (
			<div className={'user'}>

				<Helmet>
					<title>{userData.fullName}</title>
					<meta name="description" content={userData.bio} />
				</Helmet>

				<div className={'container narrow'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<UserHeader userData={userData} isUser={selfProfile} />
						</div>
					</div>
				</div>

				<div className={'container narrow nav'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<UserNav userSlug={userData.slug} activeTab={mode} />
						</div>
					</div>
				</div>

				<div className={'container narrow content'}>
					{communityPubs.map((pub)=> {
						return (
							<div key={`pub-${pub.id}`} className={'row'}>
								<div className={'col-12'}>
									<PubPreview
										title={pub.title}
										description={pub.description}
										slug={pub.slug}
										bannerImage={pub.avatar}
										isLarge={true}
										publicationDate={dateFormat(pub.updatedAt, 'mmm dd, yyyy')}
										contributors={pub.contributors.filter((item)=> {
											return !item.Contributor.isAuthor;
										})}
										authors={pub.contributors.filter((item)=> {
											return item.Contributor.isAuthor;
										})}
									/>
								</div>
							</div>
						);
					})}
					{!communityPubs.length &&
						<NonIdealState
							visual={'widget'}
							title={'No Pubs'}
							action={selfProfile ? <Link to={'/pubs/create'} className={'pt-button'}>Create New pub</Link> : undefined}
						/>
					}
				</div>
			</div>
		);
	}
}

User.propTypes = propTypes;
export default withRouter(connect(state => ({
	appData: state.app,
	userData: state.user,
	loginData: state.login,
}))(User));
