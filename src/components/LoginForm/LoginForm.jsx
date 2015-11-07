import React, { PropTypes } from 'react';
import {reduxForm} from 'redux-form';
import Radium from 'radium';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const LoginForm = React.createClass({
	propTypes: {
		fields: PropTypes.object.isRequired,
		handleSubmit: PropTypes.func.isRequired,
		resetForm: PropTypes.func.isRequired,
	},

	mixins: [PureRenderMixin],

	render: function() {
		const {
			fields: {email, password},
			handleSubmit,
			resetForm
		} = this.props;

		return (
			<form onSubmit={handleSubmit}>
				<div>
					<label>Email</label>
					<input type="text" placeholder="Email" {...email}/>
				</div>
				<div>
					<label>Password</label>
					<input type="text" placeholder="Password" {...password}/>
				</div>
				<button onClick={handleSubmit}>Submit</button>
				<button onClick={resetForm}>Clear Values</button>
			</form>
		);
	}
});

export default reduxForm({
	form: 'loginForm',
	fields: ['email', 'password']
})(Radium(LoginForm));
