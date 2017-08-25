import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import UserHeader from 'components/UserHeader/UserHeader';
import UserNav from 'components/UserNav/UserNav';
import PubPreview from 'components/PubPreview/PubPreview';

import { userData } from '../../../stories/_data';

require('./user.scss');

const propTypes = {
	// dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	// appData: PropTypes.object.isRequired,
};

class User extends Component {
	componentWillMount() {
		// Dispatch and get userData
	}

	render() {
		const contributors = [1, 2, 3, 4, 5];
		const authors = [
			{
				id: 0,
				userInitials: 'TR',
				userAvatar: '/dev/trich.jpg',
			},
			{
				id: 1,
				userInitials: 'MW',
			},
			{
				id: 2,
				userInitials: 'TW',
				userAvatar: '/dev/tomer.jpg',
			},
		];
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
					<div className={'row'}>
						<div className={'col-12'}>
							<PubPreview
								title={'Super Glue Data Engine'}
								description={'Media data accessible through APIs to build diverse applications'}
								slug={'my-article'}
								bannerImage={'/dev/banner1.jpg'}
								isLarge={true}
								publicationDate={String(new Date())}
								contributors={contributors}
								authors={authors}
							/>
						</div>
					</div>
					<div className={'row'}>
						<div className={'col-12'}>
							<PubPreview
								title={'Super Glue Data Engine'}
								description={'Media data accessible through APIs to build diverse applications'}
								slug={'my-article'}
								bannerImage={'/dev/banner1.jpg'}
								isLarge={false}
								publicationDate={String(new Date())}
								contributors={contributors}
								authors={authors}
							/>
						</div>
					</div>
					<div className={'row'}>
						<div className={'col-12'}>
							<PubPreview
								title={'Super Glue Data Engine'}
								description={'Media data accessible through APIs to build diverse applications'}
								slug={'my-article'}
								bannerImage={'/dev/banner2.jpg'}
								isLarge={false}
								publicationDate={String(new Date())}
								contributors={[]}
								authors={[authors[2]]}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

User.propTypes = propTypes;
export default withRouter(connect(state => ({
	appData: state.app
}))(User));
