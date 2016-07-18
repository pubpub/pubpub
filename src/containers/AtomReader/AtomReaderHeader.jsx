import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import dateFormat from 'dateformat';
import {globalStyles} from 'utils/styleConstants';

let styles;

export const AtomReaderHeader = React.createClass({
	propTypes: {
		title: PropTypes.string,
		authors: PropTypes.string,
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
				<p className={'atom-header-p'} style={hideStyle}>{this.props.authors}</p>
				<p className={'atom-header-p'} style={hideStyle}>{dateFormat(this.props.versionDate, 'mmmm dd, yyyy')}</p>
				{this.props.versionDate !== this.props.lastUpdated &&
					<Link to={'/a/' + this.props.slug} style={globalStyles.link}><p className={'atom-header-p'} style={[hideStyle, styles.updateAvailableNote]}>Newer Version Available: {dateFormat(this.props.lastUpdated, 'mmmm dd, yyyy')}</p></Link>
				}
				
			</div>
		);
	}
});

export default Radium(AtomReaderHeader);

styles = {
	updateAvailableNote: {
		fontWeight: 'bold',
	},
};
