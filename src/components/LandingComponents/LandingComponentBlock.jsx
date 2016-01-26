import React, { PropTypes } from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import { Link } from 'react-router';
import {LandingBody} from '../../components';
// const HoverLink = Radium(Link);

let styles = {};

const LandingComponentBlock = React.createClass({
	propTypes: {
		text: PropTypes.string,
		link: PropTypes.string,
		image: PropTypes.string,
		style: PropTypes.object,
		childArray: PropTypes.array,
		journalID: PropTypes.string,
		journalData: PropTypes.object,
	},

	imageStyle: function() {
		const output = {};
		output.height = this.props.style.height ? '100%' : 'auto'; // If they declare a height, make the image fit that.
		output.width = this.props.style.height ? 'auto' : '100%'; // If they declare a height, make the width auto, otherwise 100%.
		output.width = this.props.style.width ? '100%' : output.width; // If they decalre a width, force width to 100%, otherwise do whatever was resolved in the line above.
		return output;
	},

	blockContent: function() {
		// console.log('children in block', this.props.childArray);
		return (
				<div style={[styles.container, this.props.style]}>
					{ this.props.text
						? <div>{this.props.text}</div>
						: null
					}
					{ this.props.image
						? <img src={this.props.image} style={this.imageStyle()}/>
						: null
					}
					<LandingBody componentsArray={this.props.childArray} journalID={this.props.journalID} journalData={this.props.journalData}/>
				</div>
				
		);
	},

	render: function() {
		let output = undefined;
		if (this.props.link) {
			if (this.props.link.indexOf('http://') > -1 || this.props.link.indexOf('https://') > -1) {
				output = <a style={styles.hoverLink} href={this.props.link} target="_blank"> {this.blockContent()} </a>;
			} else {
				output = <Link style={styles.hoverLink} to={this.props.link}> {this.blockContent()} </Link>;
			}
		} else {
			output = this.blockContent();
		}

		return output;
	}
});

export default Radium(LandingComponentBlock);

styles = {
	container: {
		color: globalStyles.sideText,
	},
	image: {
		width: '100%',
		height: '100%',
	},
	hoverLink: {
		color: 'inherit',
		textDecoration: 'none',
	}
};
