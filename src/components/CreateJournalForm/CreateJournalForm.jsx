import React, { PropTypes } from 'react';
import {reduxForm} from 'redux-form';
import Radium from 'radium';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {globalStyles} from 'utils/styleConstants';

import {globalMessages} from 'utils/globalMessages';
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl';

let styles = {};

const JournalCreateForm = React.createClass({
	propTypes: {
		fields: PropTypes.object.isRequired,
		handleSubmit: PropTypes.func.isRequired,
		intl: PropTypes.object,
	},

	mixins: [PureRenderMixin],

	render: function() {
		const {
			fields: {journalName, subdomain},
			handleSubmit
		} = this.props;

		const messages = defineMessages({
			subdomainPlaceholder: {
				id: 'journals.subdomainPlaceholder',
				defaultMessage: 'Subdomain (Custom domains can be set later)',
			},
		});

		return (
			<form onSubmit={handleSubmit}>
				<div style={styles.inputWrapper}>
					<label style={styles.label}>
						<FormattedMessage {...globalMessages.journalName} />
					</label>
					<input key="journalCreateJournalName" style={styles.input} type="text" placeholder={this.props.intl.formatMessage(globalMessages.journalName)} {...journalName}/>
				</div>
				<div style={styles.inputWrapper}>
					<label style={styles.label}>
						<FormattedMessage {...globalMessages.subdomain} />
					</label>
					<div style={styles.infoText}>
						<FormattedMessage
							id="journal.journalWillLiveAt"
							defaultMessage="Journal will live at"/>
						<span style={styles.url}><span style={styles.dark}>{(subdomain.value === '' || subdomain.value === undefined) ? '[subdomain]' : subdomain.value}</span>.pubpub.org</span>
					</div>
					<input key="journalCreateSubdomain" style={styles.input} type="text" placeholder={this.props.intl.formatMessage(messages.subdomainPlaceholder)} {...subdomain}/>
				</div>
				<button type="submit" key="journalCreateSubmit" style={styles.submit} onClick={handleSubmit}>
					<FormattedMessage {...globalMessages.create} />
				</button>
			</form>
		);
	}
});

export default reduxForm({
	form: 'journalCreateForm',
	fields: ['journalName', 'subdomain']
})( injectIntl(Radium(JournalCreateForm)));

styles = {
	submit: {
		// position: 'absolute',
		// bottom: 0,
		// right: 0,
		clear: 'both',
		width: 200,
		height: 80,
		lineHeight: '80px',
		// backgroundColor: 'rgba(50,100,190,1)',
		color: globalStyles.sideText,
		textAlign: 'right',
		padding: '0px 20px',
		fontSize: '30px',
		cursor: 'pointer',
		':hover': {
			color: globalStyles.sideHover
		},
		backgroundColor: 'transparent',
		fontFamily: globalStyles.headerFont,
		borderWidth: '0px 0px 1px 0px',
		borderColor: 'transparent',
		marginLeft: 'calc(100% - 200px)',
		':focus': {
			borderColor: globalStyles.sideHover,
			outline: 'none',
		},
	},
	label: {
		opacity: 0,
		position: 'absolute',
	},
	input: {
		borderWidth: '0px 0px 1px 0px',
		borderColor: globalStyles.sideText,
		backgroundColor: 'transparent',
		margin: '30px',
		fontSize: '25px',
		width: 'calc(100% - 60px)',
		color: globalStyles.sideText,
		':focus': {
			borderWidth: '0px 0px 1px 0px',
			borderColor: globalStyles.sideHover,
			outline: 'none',
		},
		
	},
	inputWrapper: {
		position: 'relative',
	},
	infoText: {
		position: 'absolute',
		bottom: 0,
		left: 30,
		color: globalStyles.sideText,
	},
	dark: {
		color: 'black',
	},
	url: {
		fontFamily: 'Courier',
		fontSize: '15px',
		padding: '0px 5px',
	}


};
