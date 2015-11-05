import React, {PropTypes} from 'react';
import Radium from 'radium';
import Markdown from 'react-remarkable';

let styles = {};

const PubBody = React.createClass({
	propTypes: {
		title: PropTypes.string,
		abstract: PropTypes.string,
		markdown: PropTypes.string,
		html: PropTypes.string,
		authors: PropTypes.array
	},

	render: function() {
		return (
			<div style={styles.container}>
				<h1>{this.props.title}</h1>
				<p>{this.props.abstract}</p>

				<hr/>

				<Markdown source={this.props.markdown} />

			</div>
		);
	}
});


styles = {
	container: {
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		overflowY: 'scroll',
		backgroundColor: 'white',
	}
};

export default Radium(PubBody);
