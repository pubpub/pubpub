import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import dateFormat from 'dateformat';
import {globalStyles} from 'utils/styleConstants';
import {FollowButton} from 'containers';

let styles;

export const AtomReaderHeader = React.createClass({
	propTypes: {
		title: PropTypes.string,
		authors: PropTypes.array,
		versionDate: PropTypes.string,
		lastUpdated: PropTypes.string,
		titleOnly: PropTypes.bool,
		slug: PropTypes.string,

		atomID: PropTypes.string,
		isFollowing: PropTypes.bool,
		printMode: PropTypes.bool,
	},

	render: function() {
		const hideStyle = this.props.titleOnly ? {display: 'none'} : {};

		return (
			<div className={'atom-reader-header'}>

				{!this.props.printMode &&
					<FollowButton id={this.props.atomID} type={'followsAtom'} isFollowing={this.props.isFollowing} buttonStyle={styles.followButtonStyle}/>
				}
				
				<h1 className={'atom-header-title'}>{this.props.title}</h1>

				<p className={'atom-header-p'} style={hideStyle}>{this.props.authors}</p>
				<p className={'atom-header-p'} style={hideStyle}>{dateFormat(this.props.versionDate, 'mmmm dd, yyyy')}</p>
				{/* this.props.versionDate !== this.props.lastUpdated &&
					<Link to={'/pub/' + this.props.slug} style={globalStyles.link}><p className={'atom-header-p'} style={[hideStyle, styles.updateAvailableNote]}>Newer Version Available: {dateFormat(this.props.lastUpdated, 'mmmm dd, yyyy')}</p></Link>
				*/}
			</div>
		);
	}
});

export default Radium(AtomReaderHeader);

styles = {
	updateAvailableNote: {
		color: 'white',
		backgroundColor: '#2C2A2B',
		textAlign: 'center',
		padding: '.2em',
	},
	followButtonStyle: {
		float: 'right',
		fontFamily: '"Open Sans", Helvetica Neue, Arial, sans-serif',
		fontSize: '.7em',
		lineHeight: '1.5em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			float: 'none',
			maxWidth: '80%',
			margin: '2em auto 0em',
		}
	},
};
