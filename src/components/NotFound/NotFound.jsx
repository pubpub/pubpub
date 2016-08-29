import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import { Link } from 'react-router';
import {globalStyles} from 'utils/styleConstants';
import {push} from 'redux-router';

import Select from 'react-select';
import request from 'superagent';
import Helmet from 'react-helmet';

import {FormattedMessage} from 'react-intl';
import {globalMessages} from 'utils/globalMessages';

let styles = {};

export const NotFound = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		pathname: PropTypes.string,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			value: undefined,
		};
	},

	handleSelectChange: function(item) {
		// console.log(item);
		// this.setState({ value: item });
		this.props.dispatch(push(item.url));
	},

	loadOptions: function(input, callback) {
		if (!input || input.length < 3) {
			callback(null, { options: [] });
			return undefined;
		}
		request.get('/api/autocompletePubsAndUsersAndJournals?string=' + input).end((err, response)=>{
			const responseArray = response.body || [];
			const options = responseArray.map((item)=>{

				return {
					value: item.slug || item.username,
					label: item.journalName || item.name || item.title,
					id: item._id,
					url: '/' + ((item.journalName && item.slug) || (item.username && ('user/' + item.username)) || (item.title && ('pub/' + item.slug)))
				};
			});
			callback(null, { options: options });
		});
	},

	render: function() {
		const metaData = {
			title: 'Not Found · PubPub ',
			meta: [
				{'name': 'robots', 'content': 'noindex'},
				{'name': 'robots', 'content': 'nofollow'},
			]
		};

		const loggedIn = this.props.loginData && this.props.loginData.get('loggedIn');
		const loginQuery = this.props.pathname && this.props.pathname !== '/' ? '?redirect=' + this.props.pathname : ''; // Query appended to login route. Used to redirect to a given page after succesful login.

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<h2>
					<FormattedMessage id="notFound.pageDoesntExist" defaultMessage="Doh - That page does not seem to exist!"/>
				</h2>

				<img src={'https://assets.pubpub.org/_site/sadPub.png'} />

				<div style={styles.helperContent}>
					{!loggedIn &&
						<Link to={'/login' + loginQuery} style={globalStyles.link}>
							<FormattedMessage id="notFound.PerhapsLogin" defaultMessage="Perhaps you need to Login to access this page. Click to Login"/>
						</Link>
					}
				</div>

				<div style={styles.search}>
					<Select.Async
						name="form-field-name"
						minimumInput={3}
						value={this.state.value}
						loadOptions={this.loadOptions}
						placeholder={<span>Search PubPub</span>}
						onChange={this.handleSelectChange} />
				</div>

			</div>

		);
	}
});

export default connect( state => {
	return {
		loginData: state.login,
		pathname: state.router.location.pathname,
	};
})( Radium(NotFound) );

styles = {
	container: {
		textAlign: 'center',
		padding: '5em 2em',
	},
	helperContent: {
		padding: '1em 0em',
	},
	search: {
		textAlign: 'left',
		padding: '1em 0em',
		maxWidth: '650px',
		margin: '0 auto',
	}
};
