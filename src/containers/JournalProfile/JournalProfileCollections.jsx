import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import {safeGetInToJS} from 'utils/safeParse';
import Sortable from 'react-anything-sortable';
import {SortableItem } from 'components';

// import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const JournalProfileCollections = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		handleUpdateJournal: PropTypes.func,
		handleCreateCollection: PropTypes.func,
		handleUpdateCollection: PropTypes.func,
		handleDeleteCollection: PropTypes.func,
		slug: PropTypes.string,
	},

	getInitialState: function() {
		return {
			collections: [],
			newCollection: '',
			editID: null,
			editTitle: '',
		};
	},

	componentWillMount() {
		const journalData = safeGetInToJS(this.props.journalData, ['journalData']) || {};
		this.setState({ collections: journalData.collections || [] });
	},

	componentWillReceiveProps(nextProps) {
		const currentCollections = safeGetInToJS(this.props.journalData, ['journalData', 'collections']) || [];
		const nextCollections = safeGetInToJS(nextProps.journalData, ['journalData', 'collections']) || [];
		const diff = currentCollections.filter((item, index)=> {
			return item && nextCollections[index] && (item.title !== nextCollections[index].title);
		});
		
		if (currentCollections.length !== nextCollections.length || diff.length) {
			this.setState({ 
				collections: nextCollections,
				newCollection: '',
			});
		}
		this.disableEdit();
	},

	handleSort: function(sortedList) {
		this.setState({collections: sortedList});
		const newJournalData = {
			collections: sortedList.map((item)=>{ return item._id; })
		};
		this.props.handleUpdateJournal(newJournalData);
	},

	newCollectionChange: function(evt) {
		this.setState({newCollection: evt.target.value});
	},

	addCollection: function(evt) {
		evt.preventDefault();
		if (!this.state.newCollection) { return; }

		this.props.handleCreateCollection(this.state.newCollection);
	},

	enableEdit: function(id, title) {
		this.setState({editID: id, editTitle: title});
		setTimeout(()=>{
			document.getElementById(id).focus();
		}, 100);
	},
	disableEdit: function() {
		this.setState({editID: null, editTitle: ''});
	},
	handleEditTitleChange: function(evt) {
		this.setState({editTitle: evt.target.value});
	},

	editCollection: function(evt) {
		evt.preventDefault();
		this.props.handleUpdateCollection(this.state.editID, {title: this.state.editTitle});
	},

	deleteCollection: function(id) {
		this.props.handleDeleteCollection(id);
	},

	render: function() {
		const journalData = safeGetInToJS(this.props.journalData, ['journalData']) || {};
		const metaData = {
			title: 'Collections · ' + journalData.journalName,
		};
		return (
			<div>
				<Helmet {...metaData} />				

				<p>Collections let you organize the pubs featured by this journal. Add pubs to collections on the <Link to={'/' + this.props.slug + '/featured'} style={{color: 'inherit'}}>Featured</Link> page.</p>

				{/* Add Collection Field */}
				<h3>New Collection</h3>
				<form onSubmit={this.addCollection} style={styles.addCollectionForm}>
					<input type="text" style={[styles.input, styles.addCollectionInput]} value={this.state.newCollection} onChange={this.newCollectionChange}/> 
					<div className={'button'} onClick={this.addCollection} style={styles.addCollectionButton}>Add Collection</div>
				</form>
				
				{/* Sortable Collections */}
				<h3>Collections</h3>
				<Sortable onSort={this.handleSort} dynamic={true}>
					{this.state.collections.map((item, index)=>{
						const collectionBlock = (
							<div>
								{/* Default form. Shown whenever edit mode is not set */}
								<div style={[styles.collectionTable, this.state.editID === item._id && {display: 'none'}]}>
									<div style={styles.collectionBlock}>
										<span className={'dragIcon'}>{item.title}</span>
									</div>	
									<div className={'button'} style={styles.collectionButton} onClick={this.enableEdit.bind(this, item._id, item.title)}>Rename</div>
									<div className={'button'} style={styles.collectionButton} onClick={this.deleteCollection.bind(this, item._id)}>Delete</div>
								</div>
								
								{/* Edit form only shown when edit mode is properly set */}
								<form style={[styles.collectionTable, this.state.editID !== item._id && {display: 'none'}]} onSubmit={this.editCollection}>
									<input style={[styles.collectionBlock, styles.collectionBlockInput]} type={'text'} value={this.state.editTitle} onChange={this.handleEditTitleChange} id={item._id}/> 
									<div className={'button'} style={styles.collectionButton} onClick={this.editCollection}>Save</div>
									<div className={'button'} style={styles.collectionButton} onClick={this.disableEdit.bind(this, item._id)}>Cancel</div>
								</form>
								
							</div>
							
						);
						return (
							<SortableItem 
								key={'sortable-' + index} 
								sortData={item} 
								content={collectionBlock} />
						);
					})}
				</Sortable>
				 
				
			</div>
		);
	}
});

export default Radium(JournalProfileCollections);

styles = {
	collectionTable: {
		margin: '.5em 0em',
		display: 'table',
		width: '100%',
	},
	collectionBlock: {
		position: 'relative',
		border: '1px solid #BBBDC0',
		padding: '.5em',
		display: 'table-cell',
	},
	collectionBlockInput: {
		width: 'calc(100% - 1em)',
		margin: 0,
		fontSize: '1em',
		padding: 'calc(.5em + 2px)',
	},
	collectionButton: {
		display: 'table-cell',
		width: '1%',
		borderColor: '#BBBDC0',
		borderStyle: 'solid',
		borderWidth: '1px 1px 1px 0px',
		fontSize: '0.85em',
	},
	addCollectionForm: {
		marginBottom: '1.2em',
		display: 'table',
		width: '100%',
	},
	addCollectionInput: {
		display: 'table-cell',
		marginBottom: '0em',
		width: 'calc(100% - 20px - 2px)',
		borderRight: '0px solid black',
	},
	addCollectionButton: {
		display: 'table-cell',
		width: '1%',
		whiteSpace: 'nowrap',
	},
};
