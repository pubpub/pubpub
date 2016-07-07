import React, {PropTypes} from 'react';

let styles;

export const EmbedWrapper = React.createClass({
	propTypes: {
		source: PropTypes.string,
		className: PropTypes.string,
	},

	componentDidMount() {
		console.log('Mounting');
		setInterval(function(){
			console.log('bloop');
		}, 500);
	},

	componentWillUnmount() {
		console.log('Death');
	},

	render: function() {
		return (
			<div className={'killme ' + this.props.className} style={styles.container}>
				{this.props.source}
			</div>
		);
	}
});

export default EmbedWrapper;

styles = {
	container: {
		width: '50px',
		height: '50px',
		backgroundColor: 'red',
		display: 'inline-block',
	},
}
