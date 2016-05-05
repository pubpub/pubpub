import {Component, PropTypes} from 'react';
import Radium from 'radium';

@Radium
export default class Html extends Component {
	static propTypes = {
		component: PropTypes.node,
	};

	render() {
		return this.props.component;
	}
}
