import React, {PropTypes} from 'react';
import Radium from 'radium';
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
	},

	getInitialState: function() {
		return {
			logoURL: undefined,
			backgroundColor: '',
			headerMode: '',
			headerAlign: '',
		};
	},

	componentWillMount() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};
		this.setState({
			backgroundColor: jrnlData.backgroundColor || '#13A6EF',
			headerMode: jrnlData.headerMode || 'title',
			headerAlign: jrnlData.headerAlign || 'left',
		});
	},

	handleFileSelect: function(evt) {
		if (evt.target.files.length) {
			s3Upload(evt.target.files[0], ()=>{}, this.onFileFinish, 0);
		}
	},

	onFileFinish: function(evt, index, type, filename) {
		this.setState({logoUrl: 'https://assets.pubpub.org/' + filename});
	},

	handleColorChange: function(colorChange) {
		this.setState({backgroundColor: colorChange.hex});
	},
	handleHeaderModeChange: function(newHeaderMode) {
		this.setState({headerMode: newHeaderMode});
	},

	handleHeaderAlignChange: function(newHeaderAlign) {
		this.setState({headerAlign: newHeaderAlign});
	},

	saveDetails: function(evt) {
		evt.preventDefault();
		const newJrnlData = {
			jrnlName: this.refs.jrnlName.value,
			description: this.state.description,
			logo: this.state.logoURL,
			website: this.refs.website.value,
			twitter: this.refs.twitter.value,
			facebook: this.refs.facebook.value,
			about: this.state.about,
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


				<form onSubmit={this.saveDetails} style={styles.form}>
					
					<div>
						<label htmlFor={'logo'}>
							Jrnl Logo
						</label>
						{(this.state.logoURL || jrnlData.logo) &&
							<img style={styles.image} src={'https://jake.pubpub.org/unsafe/fit-in/500x75/' + (this.state.logoURL || jrnlData.logo)} />
						}
						<input id={'logo'} name={'logo image'} type="file" accept="image/*" onChange={this.handleFileSelect} />
						
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
						<ChromePicker color={this.state.backgroundColor} disableAlpha={true} onChange={this.handleColorChange}/>
					</div>

					<div>
						<label htmlFor={'logo'}>
							Background Image
						</label>
						{(this.state.logoURL || jrnlData.logo) &&
							<img style={styles.image} src={'https://jake.pubpub.org/unsafe/fit-in/500x75/' + (this.state.logoURL || jrnlData.logo)} />
						}
						<input id={'logo'} name={'logo image'} type="file" accept="image/*" onChange={this.handleFileSelect} />
						
					</div>


					<button className={'button'} onClick={this.saveDetails}>
						Save Details
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
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
	image: {
		width: '100px',
	},
	radioInput: {
		margin: '0em 1em',
	},
	radioLabel: {
		display: 'inline-block',
		fontSize: '0.95em',
	}
};
