import React, {PropTypes} from 'react';
import Radium from 'radium';
import dateFormat from 'dateformat';
// import { Link } from 'react-router';
// import {globalStyles} from 'utils/styleConstants';

let styles;

export const AtomHeader = React.createClass({
	propTypes: {
		title: PropTypes.string,
		authors: PropTypes.array,
		versionDate: PropTypes.string,
		lastUpdated: PropTypes.string,
		slug: PropTypes.string,

	},

	render: function() {

		return (
			<div className={'atom-reader-header'}>

				<h1 className={'atom-header-title'}>{this.props.title}</h1>

				<p className={'atom-header-p'}>{this.props.authors}</p>
				<p className={'atom-header-p'}>{dateFormat(this.props.versionDate, 'mmmm dd, yyyy')}</p>
				{/* this.props.versionDate !== this.props.lastUpdated &&
					<Link to={'/pub/' + this.props.slug} style={globalStyles.link}><p className={'atom-header-p'} style={[hideStyle, styles.updateAvailableNote]}>Newer Version Available: {dateFormat(this.props.lastUpdated, 'mmmm dd, yyyy')}</p></Link>
				*/}
			</div>
		);
	}
});

export default Radium(AtomHeader);

styles = {
	updateAvailableNote: {
		color: 'white',
		backgroundColor: '#2C2A2B',
		textAlign: 'center',
		padding: '.2em',
	},
};
