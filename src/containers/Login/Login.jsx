import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {toggleVisibility} from '../../actions/login';

let styles = {};

const Login = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		dispatch: PropTypes.func
	},

	mixins: [PureRenderMixin],

	toggleLogin: function() {
		this.props.dispatch(toggleVisibility());
	},

	render: function() {
		return (
			<div style={[
				styles.container,
				!this.props.loginData.get('isVisible') && styles.visible
			]}>

				{/* <DocumentMeta {...metaData} /> */}

				<h2 style={styles.text}>Login</h2>
				<p style={styles.text}>Hello Please Login!</p>
				<h3 onClick={this.toggleLogin} style={styles.text}>cancel</h3>

			</div>
		);
	}

});

export default connect( state => {
	return {loginData: state.login};
})( Radium(Login) );

styles = {
	visible: {
		opacity: 0.98,
		pointerEvents: 'auto',
	},
	container: {
		transition: '.2s ease-in opacity',
		opacity: 0,
		pointerEvents: 'none',
		backgroundColor: '#0E0E0E',
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		zIndex: 1000
	},
	text: {
		color: 'white',
		textAlign: 'center',
	}
};
