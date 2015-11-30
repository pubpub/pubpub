import React, {PropTypes} from 'react';
import Radium from 'radium';
import Markdown from 'react-remarkable';
import {PubNav, LoaderDeterminate} from '../';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubBody = React.createClass({
	propTypes: {
		status: PropTypes.string,
		openModalHandler: PropTypes.func,
		closeModalHandler: PropTypes.func,
		closeModalAndMenuHandler: PropTypes.func,
		activeModal: PropTypes.string,
		title: PropTypes.string,
		abstract: PropTypes.string,
		markdown: PropTypes.string,
		html: PropTypes.string,
		authors: PropTypes.array,
		slug: PropTypes.string
	},

	render: function() {
		return (
			<div style={styles.container}>
				<PubNav height={this.height} navClickFunction={this.props.openModalHandler} status={this.props.status} slug={this.props.slug}/>
				<LoaderDeterminate value={this.props.status === 'loading' ? 0 : 100}/>

				<div style={[styles.contentContainer, styles[this.props.status]]}>
					<h1 style={styles.pubTitle}>{this.props.title}</h1>
					<p style={styles.pubAbstract}>{this.props.abstract}</p>

					<div style={styles.headerDivider}></div>

					<Markdown source={this.props.markdown} />
				</div>
				

				{/*	Container for all modals and their backdrop. */}
				<div className="modals" style={[styles.modalWrapper, this.props.activeModal !== undefined && styles.modalWrapperActive]}>
					<div className="modal-splash" onClick={this.props.closeModalAndMenuHandler} style={[styles.modalSplash, this.props.activeModal !== undefined && styles.modalSplashActive]}></div>
					<div id="modal-container" className="modal-container" style={[styles.modalContainer, this.props.activeModal !== undefined && styles.modalContainerActive]}>
						{/*	Switch which modal is displayed based on the activeModal parameter */}
						{(() => {
							switch (this.props.activeModal) {
							case 'tableOfContents':
								return (
									<div>
										<div onClick={this.props.closeModalHandler}>Back</div>
										'tableOfContents'
									</div>
									
									);
							case 'history':
								return ('history');
							default:
								return null;
							}
						})()}

					</div>
				</div>

			</div>
		);
	}
});


styles = {
	container: {
		width: '100%',
		overflow: 'hidden',
		backgroundColor: 'white',
		borderRadius: 1,
		minHeight: 'calc(100vh - ' + globalStyles.headerHeight + ' + 3px)',
	},
	contentContainer: {
		transition: '.3s linear opacity .25s',
		padding: '0px 10px',
	},
	loading: {
		opacity: 0,
	}, 
	loaded: {
		opacity: 1
	},
	pubTitle: {
		textAlign: 'center',
		fontSize: '40px',
		margin: '50px 0px',
	},
	pubAbstract: {
		textAlign: 'center',
		fontSize: '20px',
		margin: '30px 0px',
	},
	headerDivider: {
		height: 1,
		width: '80%',
		margin: '0 auto',
		backgroundColor: '#DDD',
	},

	// Modal Styling
	contentContainerModalActive: {
		pointerEvents: 'none',
	},
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
		height: 'calc(100% - ' + globalStyles.headerHeight + ')',
		position: 'absolute',
		top: 30,
		backgroundColor: 'rgba(255,255,255,0.7)',
		transition: '.1s linear opacity',
		zIndex: 10,
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			position: 'fixed',
			width: '10vw',
			height: '100%',
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
		width: '76%',
		minHeight: 400,
		maxHeight: 'calc(100% - 150px)',
		overflow: 'hidden',
		overflowY: 'scroll',
		margin: '0 auto',
		position: 'absolute',
		top: 60,
		left: '12%',
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
			opacity: 1,
			backgroundColor: globalStyles.sideBackground,
			transform: 'scale(1.0)',
		},

	},
	modalContainerActive: {
		opacity: 1,
		pointerEvents: 'auto',
		transform: 'scale(1.0)',
	},
	// End Modal Styling
};

export default Radium(PubBody);
