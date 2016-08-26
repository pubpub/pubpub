import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Link as UnwrappedLink} from 'react-router';
const Link = Radium(UnwrappedLink);
import {HorizontalNav} from 'components';
import {AtomEditorPane} from 'containers/Atom/AtomEditorPane';
import {ensureImmutable} from 'reducers';

import {globalStyles} from 'utils/styleConstants';
let styles = {};

export const PreviewEditor = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		versionData: PropTypes.object,
		
		buttons: PropTypes.array,
		header: PropTypes.object,
		footer: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
		onSaveVersion: PropTypes.func,
		onSaveAtom: PropTypes.func,

	},

	getInitialState() {
		return {
			editorOpen: false,
			editorMode: 'content',
		};
	},

	openEditor: function(index) {
		this.setState({editorOpen: true});
	},

	closeEditor: function(index) {
		this.setState({editorOpen: false});
	},
	setEditorMode: function(mode) {
		this.setState({editorMode: mode});
	},

	// TODO
	// Save version button
	// Save details button
	// Get Details functions and data into editor on request
	// get contributors functions and data into editor on request

	render: function() {
		const atomData = this.props.atomData;
		// console.log(atomData);
		const previewImage = atomData.previewImage.indexOf('.gif') > -1 ? atomData.previewImage : 'https://jake.pubpub.org/unsafe/fit-in/50x50/' + atomData.previewImage;
		const image = previewImage || 'https://assets.pubpub.org/_site/pub.png';
		const href = '/pub/' + atomData.slug;

		// let buttons = [{ type: 'action', text: 'Edit', action: this.setEditIndex }];
		// buttons = buttons.concat(this.props.buttons);
		const buttons = this.props.buttons || [];
		
		const mobileNavButtons = [
			{ type: 'link', mobile: true, text: 'Discussions', link: '/pub/' },
			{ type: 'button', mobile: true, text: 'Menu', action: undefined },
		];

		const atomNavItems = [
			{action: this.setEditorMode.bind(this, 'content'), text: 'Content', active: this.state.editorMode === 'content'},
			{action: this.setEditorMode.bind(this, 'details'), text: 'Details', active: this.state.editorMode === 'details'},
			{action: this.setEditorMode.bind(this, 'contributors'), text: 'Contributors', active: this.state.editorMode === 'contributors'},
			{link: '/pub/' + atomData.slug + '/edit', text: 'Go To Full Editor', active: false},
		];

		return (
			<div style={styles.container}>
				{/* Custom Header content, for notifcations, details etc */}
				<div style={[styles.header, !this.props.header && {display: 'none'}]}>
					{this.props.header}
				</div>
				
				<div style={styles.table}>

					{/* Preview card image */}
					<div style={[styles.tableCell, styles.edges]}>
						<Link to={href} style={globalStyles.link}>
							<img style={styles.image} src={'https://jake.pubpub.org/unsafe/100x100/' + image} alt={atomData.title}/>
						</Link>
					</div>
					
					<div style={[styles.tableCell, styles.noMobile]}>
						<Link to={href} style={globalStyles.link}>
							<h3 style={styles.title} className={'underlineOnHover'}>{atomData.title}</h3>
						</Link>
						<div style={styles.description}>{atomData.description}</div>
					</div>

					{/* Option Buttons */}
					<div style={[styles.tableCell, styles.edges]}>
						{!this.state.editorOpen && buttons.map((item, index)=>{
							if (item.link) {
								return <Link className={'button'} to={item.link} style={styles.button} key={'previewEditor-button-' + index} >{item.text}</Link>;
							}
							if (item.action) {
								return <div className={'button'} onClick={item.action} style={styles.button} key={'previewEditor-button-' + index}>{item.text}</div>;
							}
						})}	

						{atomData.type === 'document' &&
							<div>
								<Link to={'/pub/' + atomData.slug + '/edit'} style={globalStyles.link}>
									<div className={'button'} style={styles.button}>Edit</div>
								</Link>
								<div className={'button'} onClick={this.openEditor} style={styles.button}>Delete</div>
							</div>
							
						}

						{atomData.type !== 'document' && !this.state.editorOpen && 
							<div>
								<div className={'button'} onClick={this.openEditor} style={styles.button}>Edit</div>
								<div className={'button'} onClick={this.openEditor} style={styles.button}>Delete</div>	
							</div>
							
						}

						{this.state.editorOpen &&
							<div>
								<div className={'button'} onClick={this.closeEditor} style={styles.button}>Close Editor</div>
							</div>
						}

					</div>

				</div>

				{this.state.editorOpen &&
					<div style={styles.editorWrapper}>
						<HorizontalNav navItems={atomNavItems} mobileNavButtons={mobileNavButtons}/>
						{(()=>{
							switch (this.state.editorMode) {
							case 'contributors':
								// return (
								// 	<AtomContributors 
								// 		atomData={this.props.atomData}
								// 		contributorsData={contributorsData} 
								// 		handleAddContributor={this.handleAddContributor}
								// 		handleUpdateContributor={this.handleUpdateContributor}
								// 		handleDeleteContributor={this.handleDeleteContributor}
								// 		isLoading={isLoading} 
								// 		error={error} 
								// 		permissionType={permissionType}/>
								// );
								return 'contributors';
							case 'details':
								// return <AtomDetails atomData={this.props.atomData} updateDetailsHandler={this.updateDetails} isLoading={isLoading} error={error}/>;
								return 'details';
							case 'content':
								return <AtomEditorPane ref={'atomEditorPane'} atomData={ensureImmutable({ atomData: this.props.atomData, currentVersionData: this.props.versionData })}/>;
								
							default:
								return null;
							}
						})()}
						
					</div>
				}
				

				{/* Custom Footer content, for notifcations, details etc */}
				<div style={[styles.footer, !this.props.footer && {display: 'none'}]}>
					{this.props.footer}
				</div>


			</div>
		);
	}
});

export default Radium(PreviewEditor);

styles = {
	container: {
		border: '1px solid #BBBDC0',
		borderRadius: '1px',
		margin: '1em 0em',
		backgroundColor: 'white',
	},
	image: {
		width: '2.5em',
		display: 'block',
	},
	button: {
		display: 'block',
		textAlign: 'center',
		padding: '.1em 1em',
		fontSize: '.7em',
		marginBottom: '.5em',
		minWidth: '5em', // Need min width so Follow -> Following doesn't cause resize
		whiteSpace: 'nowrap',
	},
	table: {
		display: 'table',
		width: '100%',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		}
	},
	tableCell: {
		display: 'table-cell',
		verticalAlign: 'top',
		padding: '.5em',
	},
	edges: {
		width: '1%',
	},
	title: {
		margin: 0,
		display: 'inline-block',
	},
	description: {
		fontSize: '.9em',
		margin: '.5em 0em',
	},
	noMobile: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		}
	},
	yesMobile: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		}
	},
	header: {
		fontSize: '0.9em',
		margin: '0em .5em .25em .5em',
		padding: '.5em 0em',
		borderBottom: '1px solid #F3F3F4',
	},
	editorWrapper: {
		margin: '0.0em .5em',
		// padding: '.5em 0em',
		// borderTop: '1px solid #F3F3F4',
	},
	footer: {
		fontSize: '0.9em',
		margin: '0.25em .5em 0em .5em',
		padding: '.5em 0em',
		borderTop: '1px solid #F3F3F4',
	},
};
