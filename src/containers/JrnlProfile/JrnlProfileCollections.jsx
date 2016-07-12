import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {safeGetInToJS} from 'utils/safeParse';
import Sortable from 'react-anything-sortable';
import {SortableItem } from 'components';

import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const JrnlProfileCollections = React.createClass({
	propTypes: {
		jrnlData: PropTypes.object,
		handleUpdateJrnl: PropTypes.func,
		handleCreateCollection: PropTypes.func,
	},

	getInitialState: function() {
		return {
			collections: [],
			newCollection: '',
		};
	},

	componentWillMount() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};
		this.setState({ collections: jrnlData.collections || [] });
	},

	componentWillReceiveProps(nextProps) {
		const currentCollections = safeGetInToJS(this.props.jrnlData, ['jrnlData', 'collections']) || [];
		const nextCollections = safeGetInToJS(nextProps.jrnlData, ['jrnlData', 'collections']) || [];
		if (currentCollections !== nextCollections) {
			this.setState({
				collections: nextCollections,
				newCollection: ''
			});
		}
	},

	handleSort: function(sortedList) {
		this.setState({collections: sortedList});
		const newJrnlData = {
			collections: sortedList.map((item)=>{return item._id})
		};
		this.props.handleUpdateJrnl(newJrnlData);
	},

	newCollectionChange: function(evt) {
		this.setState({newCollection: evt.target.value});
	},

	addCollection: function(evt) {
		evt.preventDefault();
		if (!this.state.newCollection) { return; }

		this.props.handleCreateCollection(this.state.newCollection);
	},

	render: function() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};
		const metaData = {
			title: 'Collections · ' + jrnlData.jrnlName,
		};
		return (
			<div>
				<Helmet {...metaData} />				

				<p>Collections let you order. Create some collections and order how you like.</p>

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
							<div style={styles.collectionBlock}>
								<span className={'dragIcon'}>{item.title}</span>
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

export default Radium(JrnlProfileCollections);

styles = {
	collectionBlock: {
		position: 'relative',
		border: '1px solid #BBBDC0',
		padding: '.5em',
		margin: '.5em 0em',
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
