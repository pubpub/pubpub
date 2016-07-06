import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link as UnwrappedLink } from 'react-router';
const Link = Radium(UnwrappedLink);

export const AtomReaderHeader = React.createClass({
	propTypes: {
		title: PropTypes.string,
		authors: PropTypes.string,
		version: PropTypes.number,
		versionDate: PropTypes.string,
		titleOnly: PropTypes.bool,
	},

	render: function() {
		const hideStyle = this.props.titleOnly ? {display: 'none'} : {};
		return (
			<div className={'atom-reader-header'}>
				
				<h1 className={'atom-header-title'}>{this.props.title}</h1>
				<p className={'atom-header-p'} style={hideStyle}>{this.props.authors}</p>
				<p className={'atom-header-p'} style={hideStyle}>Version {this.props.version}: {this.props.versionDate}</p>
				
			</div>
		);
	}
});

export default Radium(AtomReaderHeader);
