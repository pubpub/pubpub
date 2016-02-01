import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import { pushState } from 'redux-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {LoaderIndeterminate, CreateGroupForm} from '../../components';
import {create} from '../../actions/group';
import {toggleVisibility} from '../../actions/login';
import {globalStyles} from '../../utils/styleConstants';

import {FormattedMessage} from 'react-intl';

let styles = {};

const GroupCreate = React.createClass({
	propTypes: {
		groupData: PropTypes.object,
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
		if (nextProps.groupData.getIn(['createGroupData', 'groupSlug'])) {
			this.props.dispatch(pushState(null, ('/group/' + nextProps.groupData.getIn(['createGroupData', 'groupSlug']))));
		}
		this.setState({ errorMessage: nextProps.groupData.getIn(['createGroupData', 'error']) });
	},

	handleCreateSubmit: function(formValues) {
		if (!this.props.loginData.get('loggedIn')) {
			this.props.dispatch(toggleVisibility());
		} else {
			if (!formValues.groupName) {
				this.setState({errorMessage: 'noName'});
			} else if (!formValues.groupSlug) {
				this.setState({errorMessage: 'noSlug'});
			} else {
				this.props.dispatch(create(formValues.groupName, formValues.groupSlug));	
			}
			
		}
	},

	render: function() {
		return (
			<div style={styles.container}>		
				<div style={styles.loader}>
					{this.props.groupData.getIn(['createGroupData', 'status']) === 'loading'
						? <LoaderIndeterminate color={globalStyles.sideText}/>
						: null
					}
				</div>	
				
				<div style={styles.header}>
					<FormattedMessage id="group.createGroup" defaultMessage="Create Group"/>
				</div>
				<CreateGroupForm onSubmit={this.handleCreateSubmit} /> 
				<div style={[styles.error, !this.state.errorMessage && styles.hidden]}>
					{(()=>{
						switch (this.state.errorMessage) {
						case 'URL is not Unique!':
							return <FormattedMessage id="group.urlUsed" defaultMessage="Group URL is already used"/>;
						case 'noName':
							return <FormattedMessage id="group.journalNameRequired" defaultMessage="A group name is required"/>;
						case 'noSlug':
							return <FormattedMessage id="group.subdomainRequired" defaultMessage="A group URL is required"/>;
						default:
							return this.state.errorMessage;
						}
					})()}
				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {
		groupData: state.group,
		loginData: state.login,
	};
})( Radium(GroupCreate) );

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
		fontSize: '2em',
		margin: '.66em 0'
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
