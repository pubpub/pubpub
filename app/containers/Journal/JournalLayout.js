import React, { PropTypes } from 'react';
import Radium, { Style } from 'radium';
import Helmet from 'react-helmet';
import { Loader } from 'components';
import { s3Upload } from 'utils/uploadFile';
import { RadioGroup, Radio } from '@blueprintjs/core';
import { ChromePicker } from 'react-color';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { putJournal } from './actions';

let styles = {};

export const JournalLayout = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		handleHeaderUpdate: PropTypes.func,
		isLoading: PropTypes.bool,
		error: PropTypes.string,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			logo: undefined,
			headerColor: '',
			headerMode: '',
			headerAlign: '',
			headerImage: null,
		};
	},

	componentWillMount() {
		const journal = this.props.journal || {};
		this.setState({
			headerColor: journal.headerColor || '#13A6EF',
			headerMode: journal.headerMode || 'title',
			headerAlign: journal.headerAlign || 'left',
			headerImage: journal.headerImage,
		});
	},
	componentWillUnmount() {
		this.props.handleHeaderUpdate({
			logo: undefined,
			headerColor: undefined,
			headerMode: undefined,
			headerAlign: undefined,
			headerImage: undefined,
		});
	},

	handleLogoSelect: function(evt) {
		if (evt.target.files.length) {
			s3Upload(evt.target.files[0], ()=>{}, this.onLogoFinish, 0);
		}
	},

	onLogoFinish: function(evt, index, type, filename) {
		this.setState({ logo: 'https://assets.pubpub.org/' + filename });
		this.props.handleHeaderUpdate({ logo: 'https://assets.pubpub.org/' + filename });
	},

	handleHeaderImageSelect: function(evt) {
		if (evt.target.files.length) {
			s3Upload(evt.target.files[0], ()=>{}, this.onHeaderImageFinish, 0);
		}
	},

	onHeaderImageFinish: function(evt, index, type, filename) {
		this.setState({ headerImage: 'https://assets.pubpub.org/' + filename });
		this.props.handleHeaderUpdate({ headerImage: 'https://assets.pubpub.org/' + filename });
	},
	clearHeaderImageFinish: function() {
		this.setState({ headerImage: null });
		this.props.handleHeaderUpdate({ headerImage: null });
	},

	handleColorChange: function(colorChange) {
		this.setState({ headerColor: colorChange.hex });
		this.props.handleHeaderUpdate({ headerColor: colorChange.hex });
	},
	handleHeaderModeChange: function(evt) {
		const newHeaderMode = evt.target.value;
		this.setState({ headerMode: newHeaderMode });
		this.props.handleHeaderUpdate({ headerMode: newHeaderMode });
	},

	handleHeaderAlignChange: function(evt) {
		const newHeaderAlign = evt.target.value;
		this.setState({ headerAlign: newHeaderAlign });
		this.props.handleHeaderUpdate({ headerAlign: newHeaderAlign });
	},

	saveLayout: function(evt) {
		evt.preventDefault();
		const newJournalData = {
			logo: this.state.logo,
			headerColor: this.state.headerColor,
			headerMode: this.state.headerMode,
			headerAlign: this.state.headerAlign,
			headerImage: this.state.headerImage,
		};

		this.props.dispatch(putJournal(this.props.journal.id, newJournalData));
	},

	render: function() {
		const journal = this.props.journal || {};

		const metaData = {
			title: 'Layout · ' + journal.name,
		};

		const isLoading = this.props.isLoading;
		const errorMessage = this.props.error;

		return (
			<div>
				<Helmet {...metaData} />

				<Style rules={{
					'.colorPicker': { margin: '1em 0.5em', },
					'.colorPicker > div': { boxShadow: '0px 0px 0px black !important', border: '1px solid #BBBDC0 !important' },
				}} />

				<form onSubmit={this.saveLayout} style={styles.form}>

					<div>
						<label htmlFor={'logo'}>
							<FormattedMessage {...globalMessages.JournalLogo} />
						</label>
						{(this.state.logo || journal.logo) &&
							<img style={styles.image} src={'https://jake.pubpub.org/unsafe/fit-in/500x75/' + (this.state.logo || journal.logo)} />
						}
						<input id={'logo'} name={'logo image'} type="file" accept="image/*" onChange={this.handleLogoSelect} />

					</div>

					<div>
						<label htmlFor={'headerMode'}>
							<FormattedMessage {...globalMessages.HeaderMode} />
						</label>
						<RadioGroup name="header mode" selectedValue={this.state.headerMode} onChange={this.handleHeaderModeChange}>
							<Radio value="title" style={styles.radioInput} label={<FormattedMessage {...globalMessages.Title} />} />
							<Radio value="logo" style={styles.radioInput} label={<FormattedMessage {...globalMessages.Logo} />} />
							<Radio value="both" style={styles.radioInput} label={<FormattedMessage {...globalMessages.Both} />} />
						</RadioGroup>
					</div>

					<div>
						<label htmlFor={'headerAlign'}>
							<FormattedMessage {...globalMessages.HeaderAlign} />
						</label>
						<RadioGroup name="header align" selectedValue={this.state.headerAlign} onChange={this.handleHeaderAlignChange}>
							<Radio value="left" style={styles.radioInput} label={<FormattedMessage {...globalMessages.Left} />} /> 
							<Radio value="center" style={styles.radioInput} label={<FormattedMessage {...globalMessages.Center} />} /> 
						</RadioGroup>
					</div>

					<div>
						<label htmlFor={'headerAlign'}>
							<FormattedMessage {...globalMessages.BackgroundColor} />
						</label>
						<div className={'colorPicker'}>
							<ChromePicker color={this.state.headerColor} disableAlpha={true} onChange={this.handleColorChange} />
						</div>

					</div>

					<div>
						<label htmlFor={'headerImage'}>
							<FormattedMessage {...globalMessages.BackgroundImage} />
						</label>
						{this.state.headerImage &&
							<img style={styles.image} src={'https://jake.pubpub.org/unsafe/fit-in/500x0/' + this.state.headerImage} />
						}
						<input id={'headerImage'} name={'background image'} type="file" accept="image/*" onChange={this.handleHeaderImageSelect} />
						<div className={'light-color inputSubtext underlineOnHover'} onClick={this.clearHeaderImageFinish} style={[styles.clear, !this.state.headerImage && {display: 'none'}]}>
							<FormattedMessage {...globalMessages.Clear} />
						</div>

					</div>


					<button className={'pt-button pt-intent-primary'} onClick={this.saveLayout}>
						<FormattedMessage {...globalMessages.SaveLayout} />
					</button>

					<div style={styles.loaderContainer}><Loader loading={isLoading} showCompletion={!errorMessage} /></div>

					<div style={styles.errorMessage}>{errorMessage}</div>

				</form>

			</div>
		);
	}

});

export default Radium(JournalLayout);

styles = {
	form: {
		width: '500px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		}
	},
	input: {
		width: 'calc(100% - 20px - 4px)', // Calculations come from padding and border in pubpub.css
	},
	image: {
		maxWidth: '100%',
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
	radioInput: {
		margin: '0em 1em', 
		display: 'inline-block',
	},
	clear: {
		cursor: 'pointer',
	},
};
