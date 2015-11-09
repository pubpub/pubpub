import React, {PropTypes} from 'react';
import Radium from 'radium';
import Markdown from 'react-remarkable';
import {PubNav, LoaderDeterminate} from '../';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubBody = React.createClass({
	propTypes: {
		status: PropTypes.string,
		navClickFunction: PropTypes.func,
		title: PropTypes.string,
		abstract: PropTypes.string,
		markdown: PropTypes.string,
		html: PropTypes.string,
		authors: PropTypes.array
	},

	render: function() {
		return (
			<div style={styles.container}>
				<PubNav height={this.height} navClickFunction={this.props.navClickFunction} status={this.props.status}/>
				<LoaderDeterminate value={this.props.status === 'loading' ? 0 : 100}/>

				<div style={[styles.contentContainer, styles[this.props.status]]}>
					<h1>{this.props.title}</h1>
					<p>{this.props.abstract}</p>

					<hr/>

					<Markdown source={this.props.markdown} />
				</div>
				

			</div>
		);
	}
});


styles = {
	container: {
		width: '100%',
		overflow: 'hidden',
		backgroundColor: 'white',
		borderRadius: 1,
		minHeight: 'calc(100vh - ' + globalStyles.headerHeight + ' + 3px)',
	},
	contentContainer: {
		transition: '.3s linear opacity .25s',
		padding: '0px 10px',
	},
	loading: {
		opacity: 0,
	}, 
	loaded: {
		opacity: 1
	},
};

export default Radium(PubBody);
