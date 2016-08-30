import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Loader} from 'components';
import {globalStyles} from 'utils/styleConstants';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles;

export const AtomSaveVersionButton = React.createClass({
	propTypes: {
		handleVersionSave: PropTypes.func,
		isLoading: PropTypes.bool,
		error: PropTypes.string,
		buttonStyle: PropTypes.object,
	},

	getInitialState() {
		return {
			message: '',
			isPublished: false,
			noNote: false,
		};
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.isLoading && !nextProps.isLoading) {
			this.setState({message: ''});
		}
	},

	onMessageChange: function(evt) {
		this.setState({message: evt.target.value});
	},
	onPublishedChange: function(evt) {
		this.setState({isPublished: evt.target.checked});
	},

	onSave: function(evt) {
		evt.preventDefault();
		if (!this.state.message) {
			this.setState({noNote: true});
			return;
		}
		this.setState({noNote: false});
		this.props.handleVersionSave(this.state.message, this.state.isPublished);
	},

	// TODO: Route to /atom/doc when save version is finished. ANd clear our the message
	render: function() {
		return (
			<div className={'light-button arrow-down-button'} style={this.props.buttonStyle}>Save Version
				<div className={'hoverChild arrow-down-child'} style={styles.content}>
					<h2>
						<FormattedMessage {...globalMessages.SaveVersion}/>
					</h2>
					<form onSubmit={this.onSave}>
						<div style={styles.text}>
							<FormattedMessage id="aboutSaveVersionButton.FormDescription" defaultMessage="Save Versions to mark milestones in your document. Any individial version can be published."/>

						</div>


						<label htmlFor={'versionNote'}>
							Version Note
						</label>
						<input type="text" id={'versionNote'} name={'version note'} value={this.state.message} onChange={this.onMessageChange} style={styles.input}/>
						<div className={'light-color inputSubtext'}>
							Describe changes or updates.
						</div>

						<div>
							<input type="checkbox" id={'isPublished'} value={this.state.isPublished} onChange={this.onPublishedChange} style={styles.checkbox}/>
							<label htmlFor={'isPublished'} style={styles.publishLabel}>
								Publish on Save
							</label>
							<div className={'light-color inputSubtext'}>
								Publishing with permanently make this version publicly available.
							</div>

						</div>


						<button className={'button'} onClick={this.onSave} style={styles.saveVersionButton}>
							Save Version {this.state.isPublished && 'and Publish'}
						</button>
						<div style={styles.loaderContainer}><Loader loading={this.props.isLoading} showCompletion={true}/></div>
						{this.state.noNote &&
							<div style={styles.errorMessage}>Version Note required</div>
						}


					</form>
				</div>
			</div>
		);
	}
});

export default Radium(AtomSaveVersionButton);

styles = {
	content: {
		width: '400px',
		padding: '1em',
		zIndex: 1,
	},
	text: {
		whiteSpace: 'initial',
		marginBottom: '.5em',
	},
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
	checkbox: {
		marginLeft: '0em',
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
	publishLabel: {
		display: 'inline-block',
		paddingLeft: '.5em',
		marginBottom: '1.25em',
	},
	saveVersionButton: {
		whiteSpace: 'nowrap',
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
};
