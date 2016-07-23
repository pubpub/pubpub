import React, {PropTypes} from 'react';
import Radium from 'radium';
import AtomEditorDetails from './AtomEditorDetails';
import AtomEditorPublishing from './AtomEditorPublishing';
import AtomEditorSaveVersion from './AtomEditorSaveVersion';
import AtomEditorContributors from './AtomEditorContributors';
import {Loader} from 'components';

let styles = {};

export const AtomEditorModals = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
		contributorsData: PropTypes.array,
		publishingData: PropTypes.array,
		getModalData: PropTypes.func,
		mode: PropTypes.string,
		isLoading: PropTypes.bool,
		error: PropTypes.object,
		isModalLoading: PropTypes.bool,
		modalError: PropTypes.object,
		closeModalHandler: PropTypes.func,
		handleVersionSave: PropTypes.func,
		updateDetailsHandler: PropTypes.func,
		publishVersionHandler: PropTypes.func,
		handleAddContributor: PropTypes.func,
		handleUpdateContributor: PropTypes.func,
		handleDeleteContributor: PropTypes.func,
	},

	componentWillReceiveProps(nextProps) {
		const currentMode = this.props.mode;
		const nextMode = nextProps.mode;
		if (nextMode && nextMode !== currentMode && nextMode !== 'saveVersion') {
			this.props.getModalData(nextMode);
		}
	},

	componentDidMount() {
		document.addEventListener('keydown', this.closeOnEscape);
	},
	componentWillUnmount() {
		document.removeEventListener('keydown', this.closeOnEscape);
	},

	closeOnEscape: function(evt) {
		let isEscape = false;
		if ('key' in evt) { 
			isEscape = evt.key === 'Escape';
		} else { 
			isEscape = evt.keyCode === 27; 
		}

		if (isEscape) {
			this.props.closeModalHandler();
		}
	},

	render: function() {
		return (
			<div style={[styles.container, this.props.mode && styles.containerActive]}>
				<div style={styles.splash} onClick={this.props.closeModalHandler}></div>
				<div style={[styles.modalContent, this.props.mode && styles.modalContentActive]}>

					{(()=>{
						switch (!this.props.isModalLoading && this.props.mode) {
						case 'saveVersion':
							return <AtomEditorSaveVersion handleVersionSave={this.props.handleVersionSave} isLoading={this.props.isLoading}/>;
						case 'details':
							return <AtomEditorDetails atomEditData={this.props.atomEditData} updateDetailsHandler={this.props.updateDetailsHandler} isLoading={this.props.isLoading} error={this.props.error}/>;
						case 'publishing':
							return <AtomEditorPublishing publishingData={this.props.publishingData} publishVersionHandler={this.props.publishVersionHandler} isLoading={this.props.isLoading} error={this.props.error}/>;
						case 'contributors':
							return (
								<AtomEditorContributors 
									contributorsData={this.props.contributorsData} 
									handleAddContributor={this.props.handleAddContributor}
									handleUpdateContributor={this.props.handleUpdateContributor}
									handleDeleteContributor={this.props.handleDeleteContributor}
									isLoading={this.props.isLoading} 
									error={this.props.error}/>
							);
						default:
							return <div style={styles.loadingWrapper}><Loader loading={this.props.isModalLoading} showCompletion={false}/></div>;
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
		padding: '2em',
		width: 'calc(80vw - 4em)',
		maxHeight: 'calc(92vh - 4em)',
		top: '4vh',
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
			height: 'calc(80vh - 2em)',
			maxHeight: 'calc(80vh - 2em)',
			top: '10vh',
			left: '1vw',
			padding: '1em',
		},
	},
	modalContentActive: {
		transform: 'scale(1.0)',
	},
	loadingWrapper: {
		margin: '0 auto',
		width: '40px',
	}
};
