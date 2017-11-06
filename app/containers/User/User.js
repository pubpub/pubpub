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
			&& !nextProps.userData.putUserError
		) {
			this.props.history.push(`/user/${nextProps.userData.data.slug}`);
		}
	}
	handleUserEditSave(userObject) {
		this.props.dispatch(putUserData(userObject));
	}
	render() {
		const userData = this.props.userData.data || {};
		const pubs = userData.pubs || [];
		const loginData = this.props.loginData.data || {};
		const selfProfile = loginData.id && userData.id === loginData.id;
		const mode = this.props.match.params.mode;
		const localCommunityId = this.props.appData.data && this.props.appData.data.id;
		const communityPubs = pubs.filter((pub)=> {
			return !localCommunityId || pub.communityId === localCommunityId;
		});
		const externalPubs = pubs.filter((pub)=> {
			return localCommunityId && pub.communityId !== localCommunityId;
		});

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
				{!!externalPubs.length &&
					<div className={'container narrow nav'}>
						<div className={'row'}>
							<div className={'col-12'}>
								<div className={'pt-callout external-pubs-wrapper'}>
									<a href={`https://v4.pubpub.org/user/${userData.slug}`} className={'pt-button pt-intent-primary'}>Go to Full Profile</a>
									<h5>{externalPubs.length} pub{externalPubs.length === 1 ? '' : 's'} in other communities.</h5>
									<div>{userData.firstName} has published in other PubPub communities. Click to go to their full profile.</div>
								</div>
							</div>
						</div>
					</div>
				}
				<div className={'container narrow content'}>
					{communityPubs.map((pub)=> {
						return (
							<div key={`pub-${pub.id}`} className={'row'}>
								<div className={'col-12'}>
									<PubPreview
										communityData={localCommunityId ? undefined : pub.community}
										title={pub.title}
										description={pub.description}
										slug={pub.slug}
										bannerImage={pub.avatar}
										size={'medium'}
										publicationDate={dateFormat(pub.updatedAt, 'mmm dd, yyyy')}
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
					{!communityPubs.length &&
						<NonIdealState
							visual={'widget'}
							title={'No Pubs'}
							action={selfProfile ? <Link to={'/pub/create'} className={'pt-button'}>Create New pub</Link> : undefined}
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
