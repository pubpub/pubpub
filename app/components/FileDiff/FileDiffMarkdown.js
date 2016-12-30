import React, { PropTypes } from 'react';
import Radium, { Style } from 'radium';
import Diff from 'react-stylable-diff';

let styles = {};

export const FileDiffMarkdown = React.createClass({
	propTypes: {
		baseFile: PropTypes.object,
		targetFile: PropTypes.object,
	},

	getInitialState() {
		return {
			mode: 'raw'
		};
	},

	setMode: function(mode) {
		this.setState({ mode: mode });
	},

	render: function() {
		const baseFile = this.props.baseFile || {};
		const targetFile = this.props.targetFile || {};
		
		const baseText = baseFile.content;
		const targetText = targetFile.content;
		const mode = this.state.mode; // rich or raw

		return (
			<div style={styles.container} className={'image-diff-container' + targetFile.id}>

				<Style rules={{
					'.Difference': { whiteSpace: 'pre-wrap' },
					'.Difference > del': { backgroundColor: 'rgb(255, 224, 224)', textDecoration: 'none' },
					'.Difference > ins': { backgroundColor: 'rgb(201, 238, 211)', textDecoration: 'none' },
				}} />

				<div className={'pt-button-group'} style={styles.controls}>
					<button type="button" className={mode === 'rich' ? 'pt-button pt-active' : 'pt-button'} onClick={this.setMode.bind(this, 'rich')}>Rich</button>
					<button type="button" className={mode === 'raw' ? 'pt-button pt-active' : 'pt-button'} onClick={this.setMode.bind(this, 'raw')}>Raw</button>
				</div>

				<Diff inputA={baseText} inputB={targetText} type={'words'}/>
				
			</div>
		);
	}
});

export default Radium(FileDiffMarkdown);

styles = {
	container: {
		
	},
	controls: {
		position: 'absolute',
		top: '12px',
		right: '20px',
	},
	
};
