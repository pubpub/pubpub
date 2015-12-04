import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import {PubModalCite, PubModalHistory, PubModalTOC, PubModalSource} from './';
import PubModalHistoryDiff from './PubModalHistoryDiff';

let styles = {};

const PubModals = React.createClass({
	propTypes: {
		status: PropTypes.string,
		setQueryHandler: PropTypes.func,
		goBackHandler: PropTypes.func,
		closeModalAndMenuHandler: PropTypes.func,
		activeModal: PropTypes.string,

		// TOC Props
		tocData: PropTypes.array,
		// Source Props
		markdown: PropTypes.string,
		// History Props
		historyData: PropTypes.array,
		activeDiff: PropTypes.string,
	},

	render: function() {
		const activeDiffObject = this.props.historyData[this.props.activeDiff] ? this.props.historyData[this.props.activeDiff].diffObject : undefined;
		return (
			<div style={[styles.container, styles[this.props.status]]}>

				{/*	Container for all modals and their backdrop. */}
				<div className="modals" style={[styles.modalWrapper, this.props.activeModal !== undefined && styles.modalWrapperActive]}>
					<div className="modal-splash" onClick={this.props.closeModalAndMenuHandler} style={[styles.modalSplash, this.props.activeModal !== undefined && styles.modalSplashActive]}></div>
					<div id="modal-container" key={'1'} className="modal-container" style={[styles.modalContainer, this.props.activeModal !== undefined && styles.modalContainerActive, this.props.activeDiff && styles.modalContainerNoScroll]}>
						{/*	Switch which modal is displayed based on the activeModal parameter */}
						<div key={'3'} style={styles.modalBackButton} onClick={this.props.goBackHandler}>Back</div>
						{(() => {
							switch (this.props.activeModal) {
							case 'tableOfContents':
								return (<PubModalTOC 
										tocData={this.props.tocData}/>
									);
							case 'history':
								return (<PubModalHistory 
										historyData={this.props.historyData} 
										activeDiff={this.props.activeDiff}
										setQueryHandler={this.props.setQueryHandler}
										goBackHandler={this.props.goBackHandler} />
									);
							case 'source':
								return (<PubModalSource 
										markdown={this.props.markdown}/>
									);
							case 'cite':
								return (<PubModalCite/>
									);
							case 'status':
								return ('status');
							case 'discussions':
								return ('discussions');
							
							default:
								return null;
							}
						})()}

					</div>
				</div>

				<div id="modal-container" key={'2'} className="modal-container" style={[styles.modalContainer, styles.modalContainer2, this.props.activeDiff !== undefined && styles.modalContainerActive]}>
						{/*	Switch which modal is displayed based on the activeModal parameter */}
						{/* <div key={'4'} style={styles.modalBackButton} onClick={this.props.goBackHandler}>Back</div> */}

						<PubModalHistoryDiff diffObject={activeDiffObject} goBackHandler={this.props.goBackHandler}/>
				</div>

			</div>
		);
	}
});

export default Radium(PubModals);

styles = {	
	container: {
		fontFamily: globalStyles.headerFont,
		transition: '.3s linear opacity .25s',
	},
	loading: {
		opacity: 0,
	}, 
	loaded: {
		opacity: 1
	},
	// Modal Styling
	modalWrapper: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
		pointerEvents: 'none',

		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100vw',
			height: '100vh',
			// backgroundColor: 'red',
			zIndex: 9,
			transition: '.2s ease-in-out transform',
			transform: 'translateX(105%)',
		},
	},
	modalWrapperActive: {
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			transform: 'translateX(0%)',
		}
	},
	modalSplash: {
		opacity: 0,
		pointerEvents: 'none',
		width: '100%',
		// height: 'calc(100% - ' + globalStyles.headerHeight + ')',
		height: '100%',
		position: 'absolute',
		top: 0,
		backgroundColor: 'rgba(255,255,255,0.7)',
		transition: '.1s linear opacity',
		zIndex: 10,
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			position: 'fixed',
			width: '10vw',
			height: '100%',
			transition: '0s linear opacity',
			backgroundColor: 'transparent',
			left: 0,
			top: 0,
		},
	},
	modalSplashActive: {
		opacity: 1,
		pointerEvents: 'auto',
	},
	modalContainer: {
		width: '90%',
		// minHeight: 400,
		// maxHeight: 'calc(100% - 90px)',
		height: 'calc(100% - 90px)',
		overflow: 'hidden',
		overflowY: 'scroll',
		margin: '0 auto',
		position: 'absolute',
		top: 60,
		left: '5%',
		backgroundColor: 'white',
		boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.25)',
		zIndex: 150,

		opacity: 0,
		pointerEvents: 'none',
		transform: 'scale(0.8)',
		transition: '.1s linear opacity, .1s linear transform',

		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			position: 'fixed',
			width: '90vw',
			height: '100%',
			maxHeight: '100%',
			// backgroundColor: 'blue',
			left: '10vw',
			top: 0,
			// opacity: 1,
			backgroundColor: globalStyles.sideBackground,
			transition: '0s linear opacity 0.3s, 0s linear transform',
			transform: 'scale(1.0)',
		},

	},
	modalContainer2: {
		transition: 'none',
		height: 'calc(100% - 90px)',
	},
	modalContainerNoScroll: {
		// '@media screen and (min-resolution: 3dppx), (max-width: 767px)': {

		overflow: 'hidden',
		overflowY: 'hidden',
		// },
	},
	modalContainerActive: {
		opacity: 1,
		pointerEvents: 'auto',
		transform: 'scale(1.0)',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			transition: '0s linear opacity 0s, 0s linear transform',	
		},
		
	},

	modalBackButton: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			display: 'block',
			margin: '0px 0px 0px 60px',
			textAlign: 'right',
			fontSize: '2em',
			width: 'calc(100% - 100px)',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			padding: '20px 20px',
			fontFamily: globalStyles.headerFont,
			':hover': {
				cursor: 'pointer',
				color: 'black',
			},

		},
	},
};
