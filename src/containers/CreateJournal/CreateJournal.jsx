import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
// import { pushState } from 'redux-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {LoaderIndeterminate, CreateJournalForm} from '../../components';
import {create} from '../../actions/createJournal';
import {toggleVisibility} from '../../actions/login';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const Login = React.createClass({
	propTypes: {
		createJournalData: PropTypes.object,
		loginData: PropTypes.object,
		dispatch: PropTypes.func,
	},

	mixins: [PureRenderMixin],

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.createJournalData.get('subdomain')) {
			// this.props.dispatch(pushState(null, (nextProps.createJournalData.get('subdomain') + '.' + window.location.host)));
			window.location = 'http://' + nextProps.createJournalData.get('subdomain') + '.' + window.location.host + '/admin';
		}
	},

	handleCreateSubmit: function(formValues) {
		if (!this.props.loginData.get('loggedIn')) {
			this.props.dispatch(toggleVisibility());
		} else {
			this.props.dispatch(create(formValues.journalName, formValues.subdomain));	
		}
		
	},

	render: function() {
		return (
			<div style={styles.container}>		
				<div style={styles.loader}>
					{this.props.createJournalData.get('status') === 'loading'
						? <LoaderIndeterminate color={globalStyles.sideText}/>
						: null
					}
				</div>	
				
				<h1 style={styles.header}>Create Journal</h1>
				<CreateJournalForm onSubmit={this.handleCreateSubmit} /> 

			</div>
		);
	}

});

export default connect( state => {
	return {
		createJournalData: state.createJournal,
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
