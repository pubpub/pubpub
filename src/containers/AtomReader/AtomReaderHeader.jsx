import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import dateFormat from 'dateformat';
import {globalStyles} from 'utils/styleConstants';

let styles;

export const AtomReaderHeader = React.createClass({
	propTypes: {
		title: PropTypes.string,
		authors: PropTypes.array,
		versionDate: PropTypes.string,
		lastUpdated: PropTypes.string,
		titleOnly: PropTypes.bool,
		slug: PropTypes.string,
	},

	render: function() {
		const hideStyle = this.props.titleOnly ? {display: 'none'} : {};

		return (
			<div className={'atom-reader-header'}>

				<h1 className={'atom-header-title'}>{this.props.title}</h1>
				<a href={this.followUserToggle}><div className={'button'} style={styles.followButton}>Follow</div></a>

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
	followButton: {
		padding: '0em 0.2em ',
		lineHeight: '1.4em',
		fontFamily: '"Yrsa", Georgia, serif',
		marginBottom: '10px',
		fontSize: '16px',
	},
};
