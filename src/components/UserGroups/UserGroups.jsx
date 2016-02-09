import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles, navStyles} from '../../utils/styleConstants';
import { Link } from 'react-router';

// import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const UserGroups = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		ownProfile: PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			profileData: {
				discussions: [],
				pubs: [],
			},
		};
	},

	getInitialState: function() {
		return {
			mode: '',
		};
	},

	setMode: function(mode) {
		return ()=>{
			this.setState({mode: mode});
		};
	},

	render: function() {
		// console.log(this.props.profileData);
		return (
			<div style={styles.container}>

				<ul style={[navStyles.navList, styles.subNav]}></ul>
				
				{
					this.props.profileData.groups && this.props.profileData.groups.map((group)=>{
						return (<div key={'group-' + group.groupSlug}>
								<Link to={'/group/' + group.groupSlug} style={globalStyles.link}>
									{group.groupName}
								</Link>
							</div>
						);
					})

				}
				{this.props.profileData.groups.length === 0
					? <div style={globalStyles.emptyBlock}>
						<FormattedMessage id="user.noGroups" defaultMessage="No Groups Yet"/>
					</div>
					: null
				}

			</div>
		);
	}
});

export default Radium(UserGroups);

styles = {
	subNav: {
		margin: '10px 0px',
		borderBottom: '1px solid #CCC',
	},
	noLeftPadding: {
		padding: '0px 20px 0px 2px',
	},
	inactiveNav: {
		color: '#bbb',
	},
	activeNav: {
		color: '#333',
	},
};
