import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Loader} from 'components';

let styles = {};

export const AtomEditorSaveVersion = React.createClass({
	propTypes: {
		handleVersionSave: PropTypes.func,
		isLoading: PropTypes.bool,
	},
	
	getInitialState() {
		return {
			message: '',
		};
	},

	onMessageChange: function(evt) {
		this.setState({message: evt.target.value});
	},

	onSave: function(evt) {
		evt.preventDefault();
		this.props.handleVersionSave(this.state.message);
	},

	render: function() {
		return (
			<div>
				<h2>Save Version</h2>
				<form onSubmit={this.onSave}>
					
					<label htmlFor={'versionNote'}>
						Version Note
					</label>
					<input type="text" id={'versionNote'} name={'version note'} value={this.state.message} onChange={this.onMessageChange} style={styles.input}/>
					<div className={'light-color inputSubtext'} to={'/resetpassword'}>
						Describe changes or updates.
					</div>

					<button className={'button'} onClick={this.onSave}>
						Save Version
					</button>
					<div style={styles.loaderContainer}><Loader loading={this.props.isLoading} showCompletion={true}/></div>

				</form>
				
			</div>
		);
	}
});

export default Radium(AtomEditorSaveVersion);

styles = {
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
};
