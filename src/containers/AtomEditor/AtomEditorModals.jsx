import React, {PropTypes} from 'react';
import Radium from 'radium';
import SaveVersion from './AtomEditorSaveVersion';

let styles = {};

export const AtomEditorModals = React.createClass({
	propTypes: {
		mode: PropTypes.string,
		isLoading: PropTypes.bool,
		closeModalHandler: PropTypes.func,
		handleVersionSave: PropTypes.func,
	},

	render: function() {
		return (
			<div style={[styles.container, this.props.mode && styles.containerActive]}>
				<div style={styles.splash} onClick={this.props.closeModalHandler}></div>
				<div style={[styles.modalContent, this.props.mode && styles.modalContentActive]}>
					{(()=>{
						switch (this.props.mode) {
						case 'saveVersion':
							return <SaveVersion handleVersionSave={this.props.handleVersionSave} isLoading={this.props.isLoading}/>;
						default:
							return null;
						}
					})()}
				</div>
			</div>
		);
	}
});

export default Radium(AtomEditorModals);

styles = {
	container: {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100vw',
		height: '100vh',
		backgroundColor: 'rgba(0,0,0,0.6)',
		zIndex: 2,
		opacity: 0,
		pointerEvents: 'none',
		transition: '.1s linear opacity',
		
	},
	containerActive: {
		opacity: 1,
		pointerEvents: 'auto',
	},
	splash: {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100vw',
		height: '100vh',
		zIndex: 3,
	},
	modalContent: {
		position: 'fixed',
		zIndex: 4,
		padding: '1em',
		width: 'calc(80vw - 2em)',
		maxHeight: 'calc(70vh - 2em)',
		top: '15vh',
		left: '10vw',
		backgroundColor: 'white',
		overflow: 'hidden',
		overflowY: 'scroll',
		boxShadow: '0px 0px 3px rgba(0,0,0,0.7)',
		transform: 'scale(0.8)',
		transition: '.1s ease-in-out transform',
		borderRadius: '2px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(98vw - 2em)',
			height: 'calc(98vh - 2em)',
			top: '1vh',
			left: '1vw',
		},
	},
	modalContentActive: {
		transform: 'scale(1.0)',
	},
};
