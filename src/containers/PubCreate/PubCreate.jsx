import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import { pushState } from 'redux-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {LoaderIndeterminate, CreatePubForm} from '../../components';
import {create} from '../../actions/pub';
import {toggleVisibility} from '../../actions/login';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const Login = React.createClass({
	propTypes: {
		pubData: PropTypes.object,
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
		if (nextProps.pubData.getIn(['createPubData', 'slug'])) {
			this.props.dispatch(pushState(null, ('/pub/' + nextProps.pubData.getIn(['createPubData', 'slug']) + '/edit')));
		}
		this.setState({ errorMessage: nextProps.pubData.getIn(['createPubData', 'error']) });
	},

	handleCreateSubmit: function(formValues) {
		if (!this.props.loginData.get('loggedIn')) {
			this.props.dispatch(toggleVisibility());
		} else {
			if (!formValues.title) {
				this.setState({errorMessage: 'noTitle'});
			} else if (!formValues.slug) {
				this.setState({errorMessage: 'noSlug'});
			} else {
				this.props.dispatch(create(formValues.title, formValues.slug));		
			}
			
		}
		
	},

	render: function() {
		return (
			<div style={styles.container}>		
				<div style={styles.loader}>
					{this.props.pubData.getIn(['createPubData', 'status']) === 'loading'
						? <LoaderIndeterminate color={globalStyles.sideText}/>
						: null
					}
				</div>	
				
				<h1 style={styles.header}>Create Pub</h1>
				<CreatePubForm onSubmit={this.handleCreateSubmit} /> 
				<div style={[styles.error, !this.state.errorMessage && styles.hidden]}>
					{()=>{
						switch (this.state.errorMessage) {
						case 'URL Title is not Unique!':
							return 'URL is already used';
						case 'noTitle':
							return 'A title is required';
						case 'noSlug':
							return 'A URL is required';
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
		pubData: state.pub,
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
