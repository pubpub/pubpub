import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {LoaderIndeterminate, CreateJournalForm} from '../../components';
import {create} from '../../actions/journal';
import {toggleVisibility} from '../../actions/login';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const Login = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		loginData: PropTypes.object,
		dispatch: PropTypes.func,
	},

	mixins: [PureRenderMixin],

	getInitialState() {
		return {
			errorMessage: null,
		};
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.journalData.getIn(['createJournalData', 'subdomain'])) {
			window.location = 'http://' + nextProps.journalData.getIn(['createJournalData', 'subdomain']) + '.' + window.location.host + '/journal/' + nextProps.journalData.getIn(['createJournalData', 'subdomain']);
		}
		this.setState({ errorMessage: nextProps.journalData.getIn(['createJournalData', 'error']) });
	},

	handleCreateSubmit: function(formValues) {
		if (!this.props.loginData.get('loggedIn')) {
			this.props.dispatch(toggleVisibility());
		} else {
			if (!formValues.journalName) {
				this.setState({errorMessage: 'noName'});
			} else if (!formValues.subdomain) {
				this.setState({errorMessage: 'noSubdomain'});
			} else {
				this.props.dispatch(create(formValues.journalName, formValues.subdomain));	
			}
			
		}
		
	},

	render: function() {
		return (
			<div style={styles.container}>		
				<div style={styles.loader}>
					{this.props.journalData.getIn(['createJournalData', 'status']) === 'loading'
						? <LoaderIndeterminate color={globalStyles.sideText}/>
						: null
					}
				</div>	
				
				<h1 style={styles.header}>Create Journal</h1>
				<CreateJournalForm onSubmit={this.handleCreateSubmit} /> 
				<div style={[styles.error, !this.state.errorMessage && styles.hidden]}>
					{()=>{
						switch (this.state.errorMessage) {
						case 'Subdomain is not Unique!':
							return 'Subdomain is already used';
						case 'noName':
							return 'A journal name is required';
						case 'noSubdomain':
							return 'A subdomain is required';
						default:
							return this.state.errorMessage;
						}
					}()}
				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {
		journalData: state.journal,
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
	},
	error: {
		color: 'red',
		padding: '0px 30px',
		position: 'relative',
		top: '-50px',
		fontSize: '20px',
		marginRight: 200,
	},
	hidden: {
		display: 'none',
	},
};
