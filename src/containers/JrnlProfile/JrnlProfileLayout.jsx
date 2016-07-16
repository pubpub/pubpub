import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import Helmet from 'react-helmet';
import {Loader} from 'components';
import {safeGetInToJS} from 'utils/safeParse';
import {s3Upload} from 'utils/uploadFile';
import {RadioGroup, Radio} from 'utils/ReactRadioGroup';
import {ChromePicker} from 'react-color';

import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const JrnlProfileLayout = React.createClass({
	propTypes: {
		jrnlData: PropTypes.object,
		handleUpdateJrnl: PropTypes.func,
		handleHeaderUpdate: PropTypes.func,
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
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};
		this.setState({
			headerColor: jrnlData.headerColor || '#13A6EF',
			headerMode: jrnlData.headerMode || 'title',
			headerAlign: jrnlData.headerAlign || 'left',
			headerImage: jrnlData.headerImage,
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
		this.setState({logo: 'https://assets.pubpub.org/' + filename});
		this.props.handleHeaderUpdate({logo: 'https://assets.pubpub.org/' + filename});
	},

	handleHeaderImageSelect: function(evt) {
		if (evt.target.files.length) {
			s3Upload(evt.target.files[0], ()=>{}, this.onHeaderImageFinish, 0);
		}
	},

	onHeaderImageFinish: function(evt, index, type, filename) {
		this.setState({headerImage: 'https://assets.pubpub.org/' + filename});
		this.props.handleHeaderUpdate({headerImage: 'https://assets.pubpub.org/' + filename});
	},
	clearHeaderImageFinish: function() {
		this.setState({headerImage: null});
		this.props.handleHeaderUpdate({headerImage: null});
	},

	handleColorChange: function(colorChange) {
		this.setState({headerColor: colorChange.hex});
		this.props.handleHeaderUpdate({headerColor: colorChange.hex});
	},
	handleHeaderModeChange: function(newHeaderMode) {
		this.setState({headerMode: newHeaderMode});
		this.props.handleHeaderUpdate({headerMode: newHeaderMode});
	},

	handleHeaderAlignChange: function(newHeaderAlign) {
		this.setState({headerAlign: newHeaderAlign});
		this.props.handleHeaderUpdate({headerAlign: newHeaderAlign});
	},

	saveLayout: function(evt) {
		evt.preventDefault();
		const newJrnlData = {
			logo: this.state.logo,
			headerColor: this.state.headerColor,
			headerMode: this.state.headerMode,
			headerAlign: this.state.headerAlign,
			headerImage: this.state.headerImage,
		};
		this.props.handleUpdateJrnl(newJrnlData);
	},

	render: function() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};

		const metaData = {
			title: 'Layout · ' + jrnlData.jrnlName,
		};
		const isLoading = this.props.jrnlData && this.props.jrnlData.get('saveLoading');
		const errorMessage = this.props.jrnlData && this.props.jrnlData.get('saveError');

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
							Jrnl Logo
						</label>
						{(this.state.logo || jrnlData.logo) &&
							<img style={styles.image} src={'https://jake.pubpub.org/unsafe/fit-in/500x75/' + (this.state.logo || jrnlData.logo)} />
						}
						<input id={'logo'} name={'logo image'} type="file" accept="image/*" onChange={this.handleLogoSelect} />
						
					</div>

					<div>
						<label htmlFor={'headerMode'}>
							Header Mode
						</label>
						<RadioGroup name="header mode" selectedValue={this.state.headerMode} onChange={this.handleHeaderModeChange}>
							<Radio value="title" id={'headerMode1'} style={styles.radioInput}/> <label htmlFor={'headerMode1'} style={styles.radioLabel}>Title</label> <br/>
							<Radio value="logo" id={'headerMode2'} style={styles.radioInput}/> <label htmlFor={'headerMode2'} style={styles.radioLabel}>Logo</label> <br/>
							<Radio value="both" id={'headerMode3'} style={styles.radioInput}/> <label htmlFor={'headerMode3'} style={styles.radioLabel}>Both</label> <br/>
						</RadioGroup>
					</div>

					<div>
						<label htmlFor={'headerAlign'}>
							Header Align
						</label>
						<RadioGroup name="header align" selectedValue={this.state.headerAlign} onChange={this.handleHeaderAlignChange}>
							<Radio value="left" id={'headerAlign1'} style={styles.radioInput}/> <label htmlFor={'headerAlign1'} style={styles.radioLabel}>Left</label> <br/>
							<Radio value="center" id={'headerAlign2'} style={styles.radioInput}/> <label htmlFor={'headerAlign2'} style={styles.radioLabel}>Center</label> <br/>
						</RadioGroup>
					</div>

					<div>
						<label htmlFor={'headerAlign'}>
							Background Color
						</label>
						<div className={'colorPicker'}>
							<ChromePicker color={this.state.headerColor} disableAlpha={true} onChange={this.handleColorChange}/>
						</div>
						
					</div>

					<div>
						<label htmlFor={'headerImage'}>
							Background Image
						</label>
						{this.state.headerImage &&
							<img style={styles.image} src={'https://jake.pubpub.org/unsafe/fit-in/500x0/' + this.state.headerImage} />
						}
						<input id={'headerImage'} name={'background image'} type="file" accept="image/*" onChange={this.handleHeaderImageSelect} />
						<div className={'light-color inputSubtext underlineOnHover'} onClick={this.clearHeaderImageFinish} style={[styles.clear, !this.state.headerImage && {display: 'none'}]}>
							Clear
						</div>
						
					</div>


					<button className={'button'} onClick={this.saveLayout}>
						Save Layout
					</button>

					<div style={styles.loaderContainer}><Loader loading={isLoading} showCompletion={!errorMessage}/></div>

					<div style={styles.errorMessage}>{errorMessage}</div>

				</form>
				
			</div>
		);
	}

});

export default Radium(JrnlProfileLayout);

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
	},
	radioLabel: {
		display: 'inline-block',
		fontSize: '0.95em',
	},
	clear: {
		cursor: 'pointer',
	},
};
