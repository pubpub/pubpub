import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles, navStyles} from '../../utils/styleConstants';
import {DiscussionPreview, PubPreview} from '../ItemPreviews';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const UserPubs = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		ownProfile: PropTypes.string,
		username: PropTypes.string,
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
			mode: 'published',
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

				{this.props.ownProfile === 'self'
					? <ul style={[navStyles.navList, styles.subNav]}>
						<li key="subNav0"style={[navStyles.navItem, navStyles.left, navStyles.navItemShow, styles.noLeftPadding, styles.inactiveNav, this.state.mode === 'published' && styles.activeNav]} onClick={this.setMode('published')}>
							Published
						</li>
						<li style={[navStyles.navSeparator, navStyles.left, navStyles.navItemShow]}></li>

						<li key="subNav1"style={[navStyles.navItem, navStyles.left, navStyles.navItemShow, styles.inactiveNav, this.state.mode === 'unpublished' && styles.activeNav]} onClick={this.setMode('unpublished')}>
							Unpublished
						</li>
						<li style={[navStyles.navSeparator, navStyles.left, navStyles.navItemShow]}></li>

						<li key="subNav2"style={[navStyles.navItem, navStyles.left, navStyles.navItemShow, styles.inactiveNav, this.state.mode === 'canRead' && styles.activeNav]} onClick={this.setMode('canRead')}>
							Read-Only
						</li>
					</ul>
					: <ul style={[navStyles.navList, styles.subNav]}></ul>
				}
						
					

				{(()=>{
					const outputPubs = [];
					for (let index = this.props.profileData.pubs[this.state.mode].length; index--;) {
						outputPubs.push(<PubPreview 
							key={'pubItem-' + index}
							pubData={this.props.profileData.pubs[this.state.mode][index]}
							canEdit={this.props.ownProfile === 'self' ? true : false} />);
					}
					return outputPubs;
				})()}

			</div>
		);
	}
});

export default Radium(UserPubs);

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
