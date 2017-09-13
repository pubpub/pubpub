import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import { withRouter } from 'react-router-dom';
import { Spinner } from '@blueprintjs/core';
import UserHeader from 'components/UserHeader/UserHeader';
import UserNav from 'components/UserNav/UserNav';
import PubPreview from 'components/PubPreview/PubPreview';
import { getUserData } from 'actions/user';

require('./user.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	userData: PropTypes.object.isRequired,
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

		return (
			<div className={'user'}>

				<Helmet>
					<title>{userData.fullName}</title>
					<meta name="description" content={userData.bio} />
				</Helmet>

				<div className={'container narrow header'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<UserHeader userData={userData} />
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
				</div>
			</div>
		);
	}
}

User.propTypes = propTypes;
export default withRouter(connect(state => ({
	userData: state.user
}))(User));
