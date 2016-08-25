import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Loader} from 'components';

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
		this.props.handleVersionSave(this.state.message, this.state.isPublished);
	},

	// TODO: Route to /atom/doc when save version is finished. ANd clear our the message
	render: function() {
		return (
			<div className={'light-button arrow-down-button'} style={this.props.buttonStyle}>Save Version
				<div className={'hoverChild arrow-down-child'} style={styles.content}>
					<h2>Save Version</h2>
					<form onSubmit={this.onSave}>
						Save Versions to mark milestones in your document. Any individial version can be published.
						<label htmlFor={'versionNote'}>
							Version Note
						</label>
						<input type="text" id={'versionNote'} name={'version note'} value={this.state.message} onChange={this.onMessageChange} style={styles.input}/>
						<div className={'light-color inputSubtext'} to={'/resetpassword'}>
							Describe changes or updates.
						</div>

						<div>
							<label htmlFor={'isPublished'}>
								Publish
							</label>
							<input type="checkbox" id={'isPublished'} value={this.state.isPublished} onChange={this.onPublishedChange} />	
						</div>
						

						<button className={'button'} onClick={this.onSave}>
							Save Version
						</button>
						<div style={styles.loaderContainer}><Loader loading={this.props.isLoading} showCompletion={true}/></div>

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
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
};
