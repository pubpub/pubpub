import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Spinner } from '@blueprintjs/core';
import PreviewUser from 'components/PreviewUser/PreviewUser';
import PreviewPub from 'components/PreviewPub/PreviewPub';
import FollowButton from 'containers/FollowButton/FollowButton';

// import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { getLabel } from './actions';

let styles;

export const Label = React.createClass({
	propTypes: {
		labelData: PropTypes.object,
		accountData: PropTypes.object,
		params: PropTypes.object,
		location: PropTypes.object,
		dispatch: PropTypes.func,
	},

	componentWillMount() {
		const params = this.props.params || {};
		this.props.dispatch(getLabel(params.slug));
	},

	// getInitialState() {
	// 	return {
			
	// 	};
	// },

	componentWillReceiveProps(nextProps) {
		
	},

	render() {
		const label = this.props.labelData.label || {};
		const followers = label.followers || [];
		const pubs = label.pubs || [];
		
		const params = this.props.params || {};
		const query = this.props.location.query;
		const pathname = this.props.location.pathname;
		
		const accountData = this.props.accountData || {};
		const accountUser = accountData.user || {};
		const accountId = accountUser.id;
		const followData = followers.reduce((previous, current)=> {
			if (current.id === accountId) { return current.FollowsLabel; }
			return previous;
		}, undefined);

		if (this.props.labelData.loading) {
			return <div>Loading</div>;
		}
		return (
			<div style={styles.container}>
				<Helmet title={label.title || params.slug + ' · PubPub'} />
				
				<div>
					<div style={styles.followButtonWrapper}>
						<FollowButton 
							labelId={label.id} 
							followData={followData} 
							followerCount={followers.length} 
							followersLink={{ pathname: '/label/' + label.slug + '/followers' }}
							dispatch={this.props.dispatch} />
					</div>

					<h1>
						<Link to={'/label/' + label.slug}>{label.title}</Link>
					</h1>

					{!params.mode && pubs.map((pub, index)=> {
						return <PreviewPub key={'labelPub-' + index} pub={pub} />;
					})}

					{params.mode === 'followers' && 
						<div>
							<h2>Followers</h2>
							{followers.map((follower, index)=> {
								return <PreviewUser key={'follower-' + index} user={follower} />;
							})}
						</div>
					}
				</div>
				
					
			</div>
		);
	}
});

function mapStateToProps(state) {
	return {
		labelData: state.label.toJS(),
		accountData: state.account.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(Label));

styles = {
	container: {
		padding: '2em 1em',
		maxWidth: '1024px',
		margin: '0 auto',
	},
	followButtonWrapper: {
		float: 'right',
	},
};
