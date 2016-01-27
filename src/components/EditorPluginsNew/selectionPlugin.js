import React, {PropTypes} from 'react';
import createPubPubPlugin from './PubPub';

import Radium, {Style} from 'radium';
import smoothScroll from '../../utils/smoothscroll';

const SelectionInputFields = [
	{title: 'selectionNum', type: 'selection', params: {}},
];

const SelectionConfig = {
	title: 'selection',
	inline: true,
	autocomplete: false
};

let styles = {};

const SelectionPlugin = React.createClass({
	propTypes: {
		error: PropTypes.string,
		children: PropTypes.string,
		selectionItem: PropTypes.object,
	},
	getInitialState: function() {
		return {};
	},

	scrollToHighlight: function() {
		const destination = document.getElementsByClassName('selection-' + this.props.selectionItem._id)[0];
		const context = document.getElementsByClassName('centerBar')[0];
		smoothScroll(destination, 500, ()=>{}, context);
		smoothScroll(destination, 500, ()=>{}, null, -60);
	},

	hoverOn: function() {
		const items = document.getElementsByClassName('selection-' + this.props.selectionItem._id);
		// If list is empty - show hover box
		for (let index = 0; index < items.length; index++) {
			items[index].className = items[index].className.replace('selection ', 'selection selection-active ');	
		}
		
	},
	hoverOff: function() {
		const items = document.getElementsByClassName('selection-' + this.props.selectionItem._id);
		// If list is empty - remove hover box
		for (let index = 0; index < items.length; index++) {
			items[index].className = items[index].className.replace('selection selection-active ', 'selection ');	
		}
	},

	render: function() {
		// console.log('this.props', this.props);
		const styleObject = {
			borderRadius: '3px',
			padding: '0px 8px',
			color: '#5B5B5B',
			cursor: 'pointer',
			userSelect: 'none',

		};
		if (!this.props.selectionItem) {
			return (<span 
				id={'selection-block-'}
				className={'selection-block'} 
				style={styleObject} 
				onClick={this.scrollToHighlight}
				onMouseEnter={this.hoverOn}
				onMouseLeave={this.hoverOff}>

					<Style rules={{
						'.selection-block': {
							backgroundColor: 'rgba(0,0,0,0.15)',
						},
						'.selection-block-active': {
							backgroundColor: 'rgba(0,0,0,0.5)',
						},
					}} />

					selection
			</span>);
		}
		return (
			<span 
				id={'selection-block-' + this.props.selectionItem._id}
				className={'selection-block'} 
				style={styleObject} 
				onClick={this.scrollToHighlight}
				onMouseEnter={this.hoverOn}
				onMouseLeave={this.hoverOff}>

					<Style rules={{
						'.selection-block': {
							backgroundColor: 'rgba(0,0,0,0.15)',
						},
						'.selection-block-active': {
							backgroundColor: 'rgba(0,0,0,0.5)',
						},
					}} />

					selection
			</span>
		);
	}
});

styles = {
	
};


export default createPubPubPlugin(SelectionPlugin, SelectionConfig, SelectionInputFields);
