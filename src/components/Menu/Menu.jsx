import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import Menu, {SubMenu, MenuItem} from 'rc-menu';
// import {globalStyles} from '../../utils/styleConstants';
// import { Link } from 'react-router';


// import {globalMessages} from '../../utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

// <Menu> accepts an object array, 'items'
// An item has a key, a string, a function, and children:
// {
//	 key: 'assets', 				(type: String)
//	 string: 'Assets', 				(type: String)
//	 function: openModal('asset'), 	(type: function)
//	 children: [{item},{item}], 	(type: array)
// }

const UserMain = React.createClass({
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
		this.gatherFunctionCalls(this.props.items);
		console.log(this.state.functionCalls);
	},
	componentWillReceiveProps(nextProps) {
		this.gatherFunctionCalls(nextProps.items);
		console.log(this.state.functionCalls);
	},

	// Iterate over the (potentially nested) list of items
	// For each, get the function and set it to the key.
	gatherFunctionCalls: function(items) {
		for (let index = items.length; index--;) {
			const newFunctions = {...this.state.functionCalls};
			newFunctions[items[index].key] = items[index].function;
			this.setState({ functionCalls: newFunctions });

			if (items[index].children) {
				this.gatherFunctionCalls(items[index].children);
			}
		}
	},

	// Listen for the key of the clickEvent
	// Call the function associated with that key
	handleClick: function(clickEvent) {
		this.state.functionCalls[clickEvent.key]();
	},

	// Arrowkey-navigation breaks for nested menus on the right hand side.
	// Left and right keys (open and close) are unintuitive when swapped to the right.
	render: function() {

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

					<MenuItem>1</MenuItem>
					<SubMenu title="Things">
						<MenuItem>2-1</MenuItem>
						<MenuItem>2-2</MenuItem>
						<MenuItem>2-3</MenuItem>
						<MenuItem>2-4</MenuItem>
						<SubMenu title="Things223">
							<MenuItem>2-1</MenuItem>
							<MenuItem>2-2</MenuItem>
							<MenuItem>2-3</MenuItem>
							<MenuItem>2-4</MenuItem>
						</SubMenu>
					</SubMenu>
					<SubMenu title="Options" className={'right'}>
						<MenuItem>2-1</MenuItem>
						<MenuItem>2-2</MenuItem>
						<MenuItem>2-3 asdn asd asd asd finish</MenuItem>
						<SubMenu title="Sub-Optionss">
							<MenuItem><h1>2-1</h1></MenuItem>
							<MenuItem>2-2</MenuItem>
							<MenuItem>2-3</MenuItem>
							<MenuItem>2-4</MenuItem>
							<SubMenu title="Sub-Options21">
								<MenuItem>2-1</MenuItem>
								<MenuItem>2-2</MenuItem>
								<MenuItem>2-3</MenuItem>
								<MenuItem>2-4</MenuItem>
								<SubMenu title="Sub-Optionsads">
									<MenuItem>2-1</MenuItem>
									<MenuItem>2-2</MenuItem>
									<MenuItem>2-3</MenuItem>
									<MenuItem>2-4</MenuItem>
								</SubMenu>
							</SubMenu>
						</SubMenu>
						<MenuItem>2-4</MenuItem>
					</SubMenu>
				</Menu>
			</div>
		);
	}
});

export default Radium(UserMain);

styles = {
	
};
