import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import {getGroup, saveGroup} from '../../actions/group';

import {globalStyles, profileStyles, navStyles} from '../../utils/styleConstants';
import {LoaderDeterminate, GroupMain, GroupMembers, GroupSettings} from '../../components';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const Profile = React.createClass({
	propTypes: {
		groupData: PropTypes.object,
		loginData: PropTypes.object,
		groupSlug: PropTypes.string,
		mode: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		fetchDataDeferred: function(getState, dispatch, location, routerParams) {
			if (getState().group.getIn(['groupData', 'groupSlug']) !== routerParams.groupSlug) {
				return dispatch(getGroup(routerParams.groupSlug));
			}
			// return dispatch(groupNavIn());
		}
	},

	componentWillUnmount() {
		// this.props.dispatch(groupNavOut());
	},

	groupSave: function(newObject) {
		this.props.dispatch(saveGroup(this.props.groupData.getIn(['groupData', '_id']), newObject));
	},

	render: function() {
		const metaData = {};
		if (this.props.groupData.getIn(['groupData', 'groupName'])) {
			metaData.title = this.props.groupData.getIn(['groupData', 'groupName']);
		} else {
			metaData.title = this.props.groupSlug;
		}

		let groupData = {};
		if (this.props.groupData.get('groupData').toJS) {
			groupData = this.props.groupData.get('groupData').toJS();
		}

		const isAdmin = this.props.groupData.getIn(['groupData', 'isAdmin']);
		return (
			<div style={profileStyles.profilePage}>

				<Helmet {...metaData} />

				<div style={profileStyles.profileWrapper}>
					<div style={[globalStyles.hiddenUntilLoad, globalStyles[this.props.groupData.get('status')]]}>
						<ul style={navStyles.navList}>

							<Link to={'/group/' + this.props.groupSlug + '/settings'} style={globalStyles.link}><li key="profileNav0"style={[navStyles.navItem, isAdmin && navStyles.navItemShow]}>
								<FormattedMessage {...globalMessages.settings} />
							</li></Link>

							<li style={[navStyles.navSeparator, isAdmin && navStyles.navItemShow]}></li>

							<Link to={'/group/' + this.props.groupSlug + '/members'} style={globalStyles.link}><li key="profileNav1"style={[navStyles.navItem, navStyles.navItemShow]}>
								<FormattedMessage {...globalMessages.Members} />
							</li></Link>

							<li style={[navStyles.navSeparator, navStyles.navItemShow]}></li>
							
						</ul>
					</div>
					
					<LoaderDeterminate value={this.props.groupData.get('status') === 'loading' ? 0 : 100}/>

					<div style={[globalStyles.hiddenUntilLoad, globalStyles[this.props.groupData.get('status')]]}>

						<div style={[styles.groupHeader, {background: this.props.groupData.getIn(['groupData', 'background'])}]}>
							<Link to={'/group/' + this.props.groupSlug} style={globalStyles.link} >
								<div style={styles.groupName}>{groupData.groupName}</div>
							</Link>
							<div style={styles.groupDescription}>{groupData.description}</div>
						</div>	
						
						{(() => {
							switch (this.props.mode) {
							case 'members':
								return (
									<GroupMembers 
										groupData={groupData}
										saveStatus={this.props.groupData.get('memberSaveStatus')}
										handleGroupSave={this.groupSave} 
										isAdmin={isAdmin} />
								);
							case 'settings':
								return (
									<GroupSettings 
										groupData={groupData}
										groupSaving={this.props.groupData.get('groupSaving')}
										saveStatus={this.props.groupData.get('adminSaveStatus')}
										handleGroupSave={this.groupSave}
										isAdmin={isAdmin} />
								);
							default:
								return (
									<GroupMain 
										groupData={groupData} />
								);
							}
						})()}

					</div>
							
				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {
		loginData: state.login, 
		groupData: state.group, 
		groupSlug: state.router.params.groupSlug,
		mode: state.router.params.mode,
	};
})( Radium(Profile) );

styles = {
	groupHeader: {
		color: 'white',
		// width: '100vw',
		minHeight: '150px',
		position: 'relative',
		padding: '20px 20px 30px 20px',
	},
	groupName: {
		fontSize: '60px',
		paddingBottom: '15px',
	},
	groupDescription: {
		fontSize: '20px',
		width: '50%',
		color: '#ddd',
	},
};
