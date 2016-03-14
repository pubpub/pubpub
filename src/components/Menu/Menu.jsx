import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import Menu, {SubMenu, MenuItem} from 'rc-menu';
// import {globalStyles} from '../../utils/styleConstants';
// import { Link } from 'react-router';
// import {globalMessages} from '../../utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

// <Menu> accepts an object array, 'items'
// An item has a key, a string, a function, right-align boolean, and children:
// {
//	 key: 'assets', 				(type: String)
//	 string: 'Assets', 				(type: String)
//	 function: openModal('asset'), 	(type: function)
//	 right: true, 					(type: boolean)
//	 children: [{item},{item}], 	(type: array)
// }

const pubpubMenu = React.createClass({
	propTypes: {
		items: PropTypes.array,
	},

	getDefaultProps: function() {
		return {
			items: [],
		};
	},

	getInitialState() {
		return {
			functionCalls: {},
		};
	},

	componentWillMount() {
		this.gatherFunctionCalls(this.props.items, {});
	},

	componentWillReceiveProps(nextProps) {
		this.gatherFunctionCalls(nextProps.items, {});
	},

	// Iterate over the (potentially nested) list of items
	// For each, get the function and set it to the key.
	gatherFunctionCalls: function(items, functionCallHolder) {
		for (let index = items.length; index--;) {
			functionCallHolder[items[index].key] = items[index].function;
			if (items[index].children) {
				this.gatherFunctionCalls(items[index].children, functionCallHolder);
			}
		}
		this.setState({ functionCalls: functionCallHolder });
	},

	// Listen for the key of the clickEvent
	// Call the function associated with that key
	handleClick: function(clickEvent) {
		console.log('ClickEvent', clickEvent);
		this.state.functionCalls[clickEvent.key.replace('.$', '')]();
	},

	renderMenuItems: function(menuItems) {
		return menuItems.map((item)=>{
			if (item.children) {
				const props = { title: item.string, key: item.key };
				if (item.right) { props.right = true; }
				return (
					<SubMenu {...props}>
						{this.renderMenuItems(item.children)}
					</SubMenu>
				);
			}

			return <MenuItem key={item.key}>{item.string}</MenuItem>;
		});
	},

	// Arrowkey-navigation breaks for nested menus on the right hand side.
	// Left and right keys (open and close) are unintuitive when swapped to the right.
	render: function() {
		const menuItems = this.props.items || [];

		return (
			<div style={styles.container}>
				<Style rules={{
					'.rc-menu.rc-menu-horizontal.rc-menu-root': {
						height: '30px',
					},
					'.rc-menu-horizontal > .rc-menu-submenu, .rc-menu-horizontal > .rc-menu-item': {
						height: '30px',
						lineHeight: '30px',
					}
				}} />

				<Menu mode={'horizontal'} onClick={this.handleClick}>
					{ this.renderMenuItems(menuItems) }
				</Menu>
			</div>
		);
	}
});

export default Radium(pubpubMenu);

styles = {
	
};
