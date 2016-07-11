import React, {PropTypes} from 'react';

let styles;

export const EmbedWrapper = React.createClass({
	propTypes: {
		source: PropTypes.string,
		className: PropTypes.string,
	},

	componentDidMount() {
		console.log('Mounting');
		// setInterval(function(){
		// 	console.log('bloop');
		// }, 500);
	},

	componentWillUnmount() {
		console.log('Death');
	},

	render: function() {
		return (
			<div className={'killme ' + this.props.className} style={styles.container}>
				{this.props.source}
				{/* <img src="http://cdn1-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-2.jpg"/> */}
				<iframe width="420" height="315" src="https://www.youtube.com/embed/6i7ycxiog40" frameborder="0" allowfullscreen></iframe>
			</div>
		);
	}
});

export default EmbedWrapper;

styles = {
	container: {
		// width: '50px',
		// height: '50px',
		padding: '10px',
		backgroundColor: 'red',
		display: 'inline-block',
	},
}
