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
		query: PropTypes.object,

		// TOC Props
		tocData: PropTypes.array,
		// Source Props
		historyObject: PropTypes.object,
		// History Props
		historyData: PropTypes.array,
		// activeDiff: PropTypes.string,
	},

	closeModalandMenu: function(level) {
		return ()=> {
			// check if menu is open, if so, add one to level, return negative level
			const backCount = this.props.query.menu ? level + 1 : level;
			this.props.goBackHandler(-1 * backCount);
		};
	},
	closeModal: function() {
		this.props.goBackHandler(-1);
	},

	render: function() {
		const activeDiffObject = this.props.historyData[this.props.query.diff] ? this.props.historyData[this.props.query.diff].diffObject : undefined;
		const modalWrapper1Active = this.props.query.mode !== undefined;
		const modalWrapper2Active = this.props.query.diff !== undefined;
		return (
			<div className={'pubModals'} style={[styles.container, styles[this.props.status]]}>
				{/*
					Each level has to have it's own animation-in/out style, (pop for level1 on desktop, slide for all on mobile)
					Each level has to have it's own splash, that goes back the correct amount
				*/}
				

				<div className="modalsLevel1" style={[styles.modalWrapper, modalWrapper1Active && styles.modalWrapperActive]}>

					<div className="modalSplash1" onClick={this.closeModalandMenu(1)} style={[styles.modalSplash, modalWrapper1Active && styles.modalSplashActive]}>
					</div>

					<div className="modalContainer1" style={[styles.modalContainer, modalWrapper1Active && styles.modalContainerActive, modalWrapper2Active && styles.modalContainerInactive]} >

						<div key={'level1Back'} style={styles.modalBackButton} onClick={this.closeModal}>Back</div>

						{() => {
							switch (this.props.query.mode) {
							case 'tableOfContents':
								return (<PubModalTOC 
										tocData={this.props.tocData}
										closeModalAndMenuHandler={this.closeModalandMenu}/>
									);
							case 'history':
								return (<PubModalHistory 
										historyData={this.props.historyData} 
										setQueryHandler={this.props.setQueryHandler} />
									);
							case 'source':
								return (<PubModalSource 
										historyObject={this.props.historyObject}/>
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
						}()}
					</div>
				</div>


				<div className="modalsLevel2" style={[styles.modalWrapper, modalWrapper2Active && styles.modalWrapperActive]}>

					<div className="modalSplash2" onClick={this.closeModalandMenu(2)} style={[styles.modalSplash, styles.modalSplash2, modalWrapper2Active && styles.modalSplashActive]}>
					</div>

					<div className="modalContainer2" style={[styles.modalContainer, styles.modalContainer2, modalWrapper2Active && styles.modalContainerActive]} >

						<div key={'level2Back'} style={[styles.modalBackButton, styles.modalBackButtonAlwaysShow]} onClick={this.closeModal}>Back</div>

						{() => {
							if (this.props.query.diff) {
								return <PubModalHistoryDiff diffObject={activeDiffObject}/>;
							}
							return null;
						}()}
					</div>
				</div>


			</div>
		);
	}
});

export default Radium(PubModals);

styles = {	
	container: {
		fontFamily: globalStyles.headerFont,
		transition: '.3s linear opacity .25s', // This is the transition for pub load, not for modalOpen
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
			transition: '.2s linear transform',
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
	modalSplash2: {
		backgroundColor: 'transparent',
		transition: '0s linear opacity',
	},
	modalSplashActive: {
		opacity: 1,
		pointerEvents: 'auto',
	},
	modalContainer: {
		width: '90%',
		// minHeight: 400,
		maxHeight: 'calc(100% - 90px)',
		// height: 'calc(100% - 90px)',
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
		transform: 'scale(0.9)',
		transition: '.0s linear opacity, .1s linear transform',

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
		transform: 'scale(1.0)',
		transition: '.0s linear opacity',
	},
	// modalContainerNoScroll: {
	// 	// '@media screen and (min-resolution: 3dppx), (max-width: 767px)': {

	// 	overflow: 'hidden',
	// 	overflowY: 'hidden',
	// 	// },
	// },
	modalContainerActive: {
		opacity: 1,
		pointerEvents: 'auto',
		transform: 'scale(1.0)',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			transition: '0s linear opacity 0s, 0s linear transform',	
		},
		
	},
	modalContainerInactive: {
		pointerEvents: 'none',
		opacity: 0,
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			opacity: 1,
		},
	},

	modalBackButton: {
		display: 'none',
		margin: '15px',
		fontFamily: globalStyles.headerFont,
		padding: '0px',
		fontSize: '1.5em',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		textAlign: 'right',
		':hover': {
			cursor: 'pointer',
			color: 'black',
		},
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			display: 'block',
			margin: '0px 0px 0px 60px',
			fontSize: '2em',
			width: 'calc(100% - 100px)',
			padding: '20px 20px',
		},
	},
	modalBackButtonAlwaysShow: {
		display: 'block',		
	}
};
