import React, { PropTypes } from 'react';
import {reduxForm} from 'redux-form';
import Radium from 'radium';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReCAPTCHA from 'react-google-recaptcha';

import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {injectIntl, FormattedMessage} from 'react-intl';

let styles = {};

const PubCreateForm = React.createClass({
	propTypes: {
		fields: PropTypes.object.isRequired,
		handleSubmit: PropTypes.func.isRequired,
		onCreatePub: PropTypes.func.isRequired,
		intl: PropTypes.object,
	},

	mixins: [PureRenderMixin],

	onCaptchaChange: function(val) {
		this.setState({recaptchaToken: val});
	},

	onFormSubmit: function(data, submit) {
		data.recaptchaToken = this.state.recaptchaToken;
		this.props.onCreatePub(data);
	},

	render: function() {
		const {
			fields: {title, slug},
			handleSubmit
		} = this.props;
		return (
			<form onSubmit={handleSubmit(this.onFormSubmit)}>
				<div style={styles.inputWrapper}>
					<label style={styles.label}>
						<FormattedMessage {...globalMessages.Title} />
					</label>
					<input key="pubCreateTitle" style={styles.input} type="text" placeholder={this.props.intl.formatMessage(globalMessages.title)} {...title}/>
				</div>
				<div style={styles.inputWrapper}>
					<label style={styles.label}>
						<FormattedMessage {...globalMessages.url} />
					</label>
					<div style={styles.infoText}>
						<FormattedMessage
							id="pub.pubWillLiveAt"
							defaultMessage="Pub will live at"/>
						<span style={styles.url}>pubpub.org/pub/<span style={styles.dark}>{(slug.value === '' || slug.value === undefined) ? '[URL]' : slug.value}</span></span>
					</div>
					<input key="pubCreateSlug" style={styles.input} type="text" placeholder={this.props.intl.formatMessage(globalMessages.url)} {...slug}/>
				</div>

				{(!__DEVELOPMENT__) ? 
				<div style={styles.recaptcha}>
					<ReCAPTCHA
						ref="recaptcha"
						sitekey="6LfvjiATAAAAAGTr6B2nWzkOMBReIkt_XKheE1cz"
						onChange={this.onCaptchaChange} />
				</div>
				: null }

				<button type="submit" key="pubCreateSubmit" style={styles.submit(this.state.recaptchaToken)}>
					<FormattedMessage {...globalMessages.create} />
				</button>
			</form>
		);
	}
});

export default reduxForm({
	form: 'pubCreateForm',
	fields: ['title', 'slug', 'g-recaptcha-response'],
})( injectIntl(Radium(PubCreateForm)));

styles = {
	submit: function(enabled) {
		// position: 'absolute',
		// bottom: 0,
		// right: 0,
		return {
			clear: 'both',
			width: 200,
			height: 80,
			lineHeight: '80px',
			// backgroundColor: 'rgba(50,100,190,1)',
			color: (enabled) ? globalStyles.sideText : globalStyles.sideTextDisabled,
			textAlign: 'right',
			padding: '0px 20px',
			fontSize: '30px',
			cursor: (enabled) ? 'pointer' : 'not-allowed',
			':hover': {
				color: (enabled) ? globalStyles.sideHover : globalStyles.sideTextDisabled,
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
		};
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
	recaptcha: {
		position: 'relative',
		left: 30,
		top: 30,
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
