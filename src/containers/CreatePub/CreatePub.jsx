import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import PureRenderMixin from 'react-addons-pure-render-mixin';
// import {toggleVisibility, toggleViewMode, login, register} from '../../actions/login';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const Login = React.createClass({
	propTypes: {
		loginData: PropTypes.object
	},

	mixins: [PureRenderMixin],

	render: function() {
		return (
			<div style={styles.container}>			

				<h1>Create Pub</h1>

			</div>
		);
	}

});

export default connect( state => {
	return {loginData: state.login};
})( Radium(Login) );

styles = {
	
};
