import React, { PropTypes } from 'react';
import Radium from 'radium';
import {MultiSelect} from 'react-selectize';
import {FormattedMessage} from 'react-intl';
import isValidEmail from 'valid-email';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubMetaInvite = React.createClass({
	propTypes: {
		handleSubmitInvites: PropTypes.func,
		inviteStatus: PropTypes.string
	},

	getInitialState: function() {
		return {
			tags: []
		};
	},

	getDefaultProps: function() {
		return {
		};
	},

	sendInvites: function() {
		// console.log(this.getEmailObjects());
		return this.props.handleSubmitInvites(this.getEmailObjects());
	},

	parseEmails: function(search) {

		const result = {};
		const searchWords = search.split(' ');

		// if (search.charAt(0) === '@') {
		// 	result.twitter = search;
		// } else if (isValidEmail(searchWords[searchWords.length - 1])) {
		result.email = searchWords[searchWords.length - 1];
			// searchWords.splice(searchWords.length - 1, searchWords.length - 1);
			// result.name = searchWords.join(' ');
		// }

		return result;
	},

	checkEmailResult: function(search, returnReason) {

		if (search.length === 0) {
			return (returnReason) ? 'Enter an email address, e.g. betty@example.com' : null;
		}

		let result;
		const searchWords = search.split(' ');

		if (search.charAt(0) === '@') {
			result = (returnReason) ? null : true;
		// } else if (isValidEmail(searchWords[searchWords.length - 1]) && searchWords.length > 1) {
		} else if ( isValidEmail(searchWords[searchWords.length - 1]) ) {
			result = (returnReason) ? null : true;
		} else {
			result = (returnReason) ? 'Enter an email address, e.g. betty@example.com' : false;
		}
		return result;
	},

	createFromSearch: function(options, values, search) {
		if (!this.checkEmailResult(search, false)) {
			return null;
		}

		return {label: search, value: search};
	},

	getEmailObjects: function() {
		return this.state.tags.map(function(tag) {
			return this.parseEmails(tag.label);
		}.bind(this));
	},

	getEmails: function() {
		return this.state.tags.map(function(tag) {return tag.label;});
	},
	tagUsed: function(label) {
		const found = this.getEmails().indexOf(label) !== -1;
		return found;
	},
	noResults: function(values, search) {
		const result = this.checkEmailResult(search, true);
		return (<div className = "no-results-found">
			{(() => {
				return result;
			})()}
		</div>);
	},

	render: function() {
		const self = this;
		let selectedElem;
		switch (this.props.inviteStatus) {
		case 'loading':
			selectedElem =	(<div>Sending Invitations...</div>);
			break;
		case 'success':
			selectedElem =	(<div>Sent Invitations!</div>);
			break;
		default:
			selectedElem = (<span>
				<MultiSelect
					style={styles.complete}
					values = {this.state.tags}
					placeholder="example: betty@example.com"
					onValuesChange = {(tags, callback) => {
						self.setState({tags: tags}, callback);
					}}
					createFromSearch = {this.createFromSearch}
					renderNoResultsFound = {this.noResults} />
				<div style={[globalStyles.button, styles.submit]} onClick={this.sendInvites}>Invite</div>
			</span>);
		}

		return (
			<div style={styles.container}>

				<div style={globalStyles.paragraph}>
					<FormattedMessage id="pubMeta.inviteMessage"
						defaultMessage="Do you know someone who might have a have an interesting opinion on this paper? Invite them to join the discussion! We will send them a message and help them create accounts."/>
				</div>
				{selectedElem}
			</div>
		);
	}
});

export default Radium(PubMetaInvite);

styles = {
	complete: {
		margin: '25px 0px 50px'
	},
	submit: {
		float: 'right'
	},
	container: {
		padding: 15,
		width: '500px'
	}
};
