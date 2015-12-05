import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import { pushState } from 'redux-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {LoaderIndeterminate, CreatePubForm} from '../../components';
import {create} from '../../actions/createPub';
import {toggleVisibility} from '../../actions/login';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const Login = React.createClass({
	propTypes: {
		createPubData: PropTypes.object,
		loginData: PropTypes.object,
		dispatch: PropTypes.func,
	},

	mixins: [PureRenderMixin],

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.createPubData.get('slug')) {
			this.props.dispatch(pushState(null, ('/pub/' + nextProps.createPubData.get('slug') + '/edit')));
		}
	},

	handleCreateSubmit: function(formValues) {
		if (!this.props.loginData.get('loggedIn')) {
			this.props.dispatch(toggleVisibility());
		} else {
			this.props.dispatch(create(formValues.title, formValues.slug));	
		}
		
	},

	render: function() {
		return (
			<div style={styles.container}>		
				<div style={styles.loader}>
					{this.props.createPubData.get('status') === 'loading'
						? <LoaderIndeterminate color={globalStyles.sideText}/>
						: null
					}
				</div>	
				
				<h1 style={styles.header}>Create Pub</h1>
				<CreatePubForm onSubmit={this.handleCreateSubmit} /> 

			</div>
		);
	}

});

export default connect( state => {
	return {
		createPubData: state.createPub,
		loginData: state.login,
	};
})( Radium(Login) );

styles = {
	container: {
		fontFamily: globalStyles.headerFont,
		position: 'relative',
		maxWidth: 800,
		margin: '0 auto',
	},
	header: {
		color: globalStyles.sideText,
		padding: 20,
	},
	loader: {
		position: 'absolute',
		top: 10,
		width: '100%',
	}
};
