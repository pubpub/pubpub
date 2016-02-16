import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles, navStyles} from '../../utils/styleConstants';
import {DiscussionPreview} from '../ItemPreviews';

// import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const UserDiscussions = React.createClass({
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
				
				{(()=>{
					const outputDiscussions = [];
					for (let index = this.props.profileData.discussions.length; index--;) {
						outputDiscussions.push(<DiscussionPreview 
							key={'discussionItem-' + index}
							discussionData={this.props.profileData.discussions[index]}
							canEdit={this.props.ownProfile === 'self' ? true : false} />);
					}
					return outputDiscussions;
				})()}
				{this.props.profileData.discussions.length === 0
					? <div style={globalStyles.emptyBlock}>
						<FormattedMessage id="user.noDiscussions" defaultMessage="No Discussions Yet"/>
					</div>
					: null
				}

			</div>
		);
	}
});

export default Radium(UserDiscussions);

styles = {
	subNav: {
		// margin: '10px 0px',
		// borderBottom: '1px solid #CCC',
		fontSize: '15px',
		margin: '0px 0px 35px 0px',

	},
	noLeftPadding: {
		padding: '0px 20px 0px 2px',
	},
	inactiveNav: {
		color: '#bbb',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '15px',
		}
	},
	activeNav: {
		color: '#333',
	},
};
