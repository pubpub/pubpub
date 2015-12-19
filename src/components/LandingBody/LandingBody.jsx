import React, {PropTypes} from 'react';
import Radium from 'radium';
import {LandingComponentBlock, LandingComponentSearch} from '../LandingComponents';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const LandingBody = React.createClass({
	propTypes: {
		componentsArray: PropTypes.array,
	},

	getDefaultProps: function() {
		return {
			componentsArray: [],
		};
	},

	render: function() {
		// console.log(typeof(window) !== 'undefined');
		return (
			<div style={styles.container}>
				{
					this.props.componentsArray.map((component, index)=>{
						// console.log(component);
						switch (component.type) {
						case 'block': 
							return <LandingComponentBlock key={'LandingComponent-' + index} text={component.text} link={component.link} image={component.image} style={component.style}/>;
						case 'search': 
							return <LandingComponentSearch key={'LandingComponent-' + index} />;
						default:
							return null;
						}
					})
				}
			</div>
		);
	}
});

export default Radium(LandingBody);

styles = {
	container: {
		width: '100vw',
		// height: 'calc(100vh - 30px)',
		position: 'relative',
		overflow: 'hidden',
		marginTop: 30,
		// transform: typeof(window) !== 'undefined' ? 'scale(' + document.getElementById('landingPreviewContainer').clientWidth / window.innerWidth + ')' : '',
		// transformOrigin: '0% 0%',
	},
};

// type
// text
// link
// image
// style
