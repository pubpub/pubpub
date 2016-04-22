import React, {PropTypes} from 'react';
import createPubPubPlugin from './PubPub';
import Radium from 'radium';

const InputFields = [
];

const Config = {
	title: 'cursor',
	inline: true,
	autocomplete: false,
	color: 'rgba(245, 245, 169, 0.5)',
};

let styles = {};

const Plugin = React.createClass({
	propTypes: {
	},
	getInitialState: function() {
		return {};
	},
	render: function() {

		// return (<span className='markdown-cursor' style={styles.cursor}></span>);
		return (<span className='markdown-cursor'></span>);
	}
});

var blinkKeyFrames = Radium.keyframes({
  '0%': {backgroundColor: 'white'},
	'49%': {backgroundColor: 'white'},
  '50%': {backgroundColor: 'black'},
	'99%': {backgroundColor: 'black'},
  '100%': {backgroundColor: 'white'},
}, 'blink');


styles = {
	cursor: {
		height: '1em',
		width: '3px',
		position: 'relative',
		top: '0.2em',
		display: 'inline-block',
		margin: '0px 0px',
		// filter: 'invert(100%)',
		// backgroundColor: 'black',
		animation: 'x 1s linear 0s infinite',
		animationName: blinkKeyFrames,
	}
};

export default createPubPubPlugin(Plugin, Config, InputFields);
