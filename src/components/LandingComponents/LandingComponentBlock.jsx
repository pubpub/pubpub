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
	},

	blockContent: function() {
		console.log('children in block', this.props.childArray);
		return (
				<div>
					{ this.props.text
						? <div>{this.props.text}</div>
						: null
					}
					{ this.props.image
						? <img src={this.props.image} style={styles.image}/>
						: null
					}
					<LandingBody componentsArray={this.props.childArray} />
				</div>
				
		);
	},

	render: function() {
		return (
			<div style={[styles.container, this.props.style]}>
				{
					this.props.link
						? <Link style={styles.hoverLink} to={this.props.link}>
								{this.blockContent()}
							</Link>
						: this.blockContent()
				}
			</div>
		);
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
