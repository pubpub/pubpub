import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import Menu, {SubMenu, MenuItem} from 'rc-menu';

/* **********************
<Menu> accepts an object array, 'items'
An item has a key, a string, a function, right-align boolean, and children:
	{
	 key: 'assets', 				(type: String)
	 string: 'Assets', 				(type: String)
	 function: openModal('asset'), 	(type: function)
	 right: true, 					(type: boolean) // floats right
 	 notButton: true, 				(type: boolean) // removes line and click behavior
 	 isActive: true, 				(type: boolean) // adds isActive class and style
 	 noSeparator: true, 			(type: boolean) // removes line separator after item
	 children: [{item},{item}], 	(type: array)
	}
********************** */
const pubpubMenu = React.createClass({
	propTypes: {
		items: PropTypes.array,
		submenu: PropTypes.bool,

		customClass: PropTypes.string, // Custom class is required if you wanna do any changing of heights, fontSizes, etc
		height: PropTypes.string,
		fontSize: PropTypes.string,
		fontWeight: PropTypes.string,
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
		this.state.functionCalls[clickEvent.key.replace('.$', '')]();
	},

	renderMenuItems: function(menuItems) {
		return menuItems.map((item)=>{
			let className = 'menuItem-' + item.key;
			className += item.notButton ? ' notButton' : '';
			className += item.noSeparator ? ' noSeparator' : '';
			className += item.isActive ? ' isActive' : '';
			if (item.children) {
				return (
					<SubMenu title={item.string} key={item.key} className={item.right ? className + ' right' : className} disabled={item.notButton}>
						{this.renderMenuItems(item.children)}
					</SubMenu>
				);
			}

			return <MenuItem key={item.key} className={item.right ? className + ' right' : className} disabled={item.notButton}>{item.string}</MenuItem>;
		});
	},
	customCSS: function() {
		if (!this.props.customClass) { return {}; }
		const customClassedCSS = {};
		customClassedCSS['.' + this.props.customClass + ' .rc-menu.rc-menu-horizontal.rc-menu-root'] = {
			height: this.props.height || '30px',
		};
		customClassedCSS['.' + this.props.customClass + ' .rc-menu-horizontal > .rc-menu-submenu'] = {
			height: this.props.height || '30px',
			lineHeight: this.props.height || '30px',
		};
		customClassedCSS['.' + this.props.customClass + ' .rc-menu-horizontal > .rc-menu-item'] = {
			height: this.props.height || '30px',
			lineHeight: this.props.height || '30px',
		};
		return customClassedCSS;
	},

	// Arrowkey-navigation breaks for nested menus on the right hand side.
	// Left and right keys (open and close) are unintuitive when swapped to the right.
	render: function() {
		const menuItems = this.props.items || [];

		return (
			<div className={this.props.customClass} style={{
				fontSize: this.props.fontSize || '1em',
				fontWeight: this.props.submenu ? (this.props.fontWeight || '400') : (this.props.fontWeight || '300'),
				backgroundColor: this.props.submenu ? '#F3F3F3' : 'transparent',
				color: this.props.submenu ? '#999' : '#333',
			}}>
				<Style rules={{
					'.rc-menu.rc-menu-horizontal.rc-menu-root': {
						height: '30px',
					},
					'.rc-menu-horizontal > .rc-menu-submenu, .rc-menu-horizontal > .rc-menu-item': {
						height: '30px',
						lineHeight: '30px',
					},
					...this.customCSS(),
				}} />

				<Menu mode={'horizontal'} onClick={this.handleClick}>
					{ this.renderMenuItems(menuItems) }
				</Menu>
			</div>
		);
	}
});

export default Radium(pubpubMenu);
