import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import { withRouter, Link } from 'react-router-dom';
import { NonIdealState } from '@blueprintjs/core';
import UserHeader from 'components/UserHeader/UserHeader';
import UserNav from 'components/UserNav/UserNav';
import Loading from 'components/Loading/Loading';
import PubPreview from 'components/PubPreview/PubPreview';
import { getUserData } from 'actions/user';

require('./user.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	userData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
};

class User extends Component {
	componentWillMount() {
		this.props.dispatch(getUserData(this.props.match.params.slug));
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.slug !== this.props.match.params.slug) {
			this.props.dispatch(getUserData(nextProps.match.params.slug));
		}
	}

	render() {
		const userData = this.props.userData.data || {};
		const loginData = this.props.loginData.data || {};
		const selfProfile = loginData.id && userData.id === loginData.id;

		if (!userData.id) {
			return (
				<div className={'user'}>
					<div className={'container narrow user-header-wrapper'}>
						<div className={'row'}>
							<div className={'col-12'}>
								<Loading float={'right'} width={150} height={150} borderRadius={150} />
								<Loading height={32} width={'calc(80% - 150px)'} />
								<Loading width={'calc(60% - 150px)'} />
								<Loading margin={'2.5em 0em 0.25em'} width={'calc(90% - 150px)'} height={10} />
								<Loading margin={'0.25em 0em 0.25em'} width={'calc(90% - 150px)'} height={10} />
							</div>
						</div>
					</div>
					<div className={'container narrow nav'}>
						<div className={'row'}>
							<div className={'col-12'}>
								<hr />
							</div>
						</div>
					</div>
				</div>
			);
		}
		return (
			<div className={'user'}>

				<Helmet>
					<title>{userData.fullName}</title>
					<meta name="description" content={userData.bio} />
				</Helmet>

				<div className={'container narrow user-header-wrapper'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<UserHeader userData={userData} isUser={selfProfile} />
						</div>
					</div>
				</div>

				<div className={'container narrow nav'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<UserNav userSlug={userData.slug} activeTab={this.props.match.params.mode} />
						</div>
					</div>
				</div>

				<div className={'container narrow content'}>
					{userData.pubs && userData.pubs.map((pub)=> {
						return (
							<div key={`pub-${pub.id}`} className={'row'}>
								<div className={'col-12'}>
									<PubPreview
										title={pub.title}
										description={pub.description}
										slug={pub.slug}
										bannerImage={pub.headerImage}
										isLarge={true}
										publicationDate={dateFormat(pub.updatedAt, 'mmm dd, yyyy')}
										contributors={pub.contributors.filter((item)=> {
											return !item.Contributor.isAuthor;
										})}
										authors={pub.contributors.filter((item)=> {
											return !item.Contributor.isAuthor;
										})}
									/>
								</div>
							</div>
						);
					})}
					{userData.pubs && !userData.pubs.length &&
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
	userData: state.user,
	loginData: state.login,
}))(User));
