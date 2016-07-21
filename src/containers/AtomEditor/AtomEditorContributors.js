import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import Select from 'react-select';
import request from 'superagent';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard, SelectValue, SelectOption} from 'components';
import dateFormat from 'dateformat';
import {RadioGroup, Radio} from 'utils/ReactRadioGroup';

// import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const AtomEditorContributors = React.createClass({
	propTypes: {
		contributorsData: PropTypes.array,
		handleAddContributor: PropTypes.func,
		handleUpdateContributor: PropTypes.func,
		handleDeleteContributor: PropTypes.func,
	},

	getInitialState: function() {
		return {
			value: null,
			contributorStates: {},
		};
	},
	
	componentWillMount() {
		const typesObject = {};
		
		this.props.contributorsData.map((item)=> {
			const roles = item.metadata ? item.metadata.roles : [];
			typesObject[item._id] = {
				type: item.type,
				roles: roles,
			};
		});
		this.setState({contributorStates: typesObject});
	},

	componentWillReceiveProps(nextProps) {
		const currentContributors = this.props.contributorsData || [];
		const nextContributors = nextProps.contributorsData || [];
		if (currentContributors.length !== nextContributors.length) {
			this.setState({value: null});
		}
	},

	handleSelectChange: function(value) {
		this.setState({ value });
	},

	loadOptions: function(input, callback) {
		request.get('/api/autocompleteUsers?string=' + input).end((err, response)=>{
			const responseArray = response.body || [];
			const options = responseArray.map((item)=>{
				return {
					value: item.slug,
					label: item.name,
					slug: item.username,
					image: item.image,
					id: item._id,
				};
			});
			callback(null, { options: options });
		});
	},

	addContributor: function() {
		if (!this.state.value.id) { return undefined; }
		this.props.handleAddContributor(this.state.value.id);
	},

	handleTypeChange: function(linkID, newType) {
		this.setState({
			contributorStates: {
				...this.state.contributorStates,
				[linkID]: {
					type: newType,
					roles: this.state.contributorStates[linkID].roles
				}
			}
		});
		this.updateContributor(linkID);
	},

	handleRoleChange: function(linkID, roleList) {
		this.setState({
			contributorStates: {
				...this.state.contributorStates,
				[linkID]: {
					type: this.state.contributorStates[linkID].type,
					roles: roleList
				}
			}
		});
		this.updateContributor(linkID);
	},

	updateContributor: function(linkID) {
		const type = this.state.contributorStates[linkID].type;
		const roles = this.state.contributorStates[linkID].roles;
		this.props.handleUpdateContributor(linkID, type, roles);
	},

	deleteAdmin: function(contributorID) {
		if (!contributorID) { return undefined; }
		this.props.handleDeleteContributor(contributorID);
	},

	render: function() {
		// const atomData = safeGetInToJS(this.props.atomData, ['atomData']) || {};
		const contributorsData = this.props.contributorsData || [];
		const roleOptions = [
			{value: 'conceptualization', label: 'Conceptualization'},
			{value: 'methodology', label: 'Methodology'},
			{value: 'software', label: 'Software'},
			{value: 'validation', label: 'Validation'},
			{value: 'formalAnalysis', label: 'Formal Analysis'},
			{value: 'investigation', label: 'Investigation'},
			{value: 'resources', label: 'Resources'},
			{value: 'dataCuration', label: 'Data Curation'},
			{value: 'writingOriginalDraftPreparation', label: 'Writing – Original Draft Preparation'},
			{value: 'writingReview&Editing', label: 'Writing – Review & Editing'},
			{value: 'visualization', label: 'Visualization'},
			{value: 'supervision', label: 'Supervision'},
			{value: 'projectAdministration', label: 'Project Administration'},
			{value: 'fundingAcquisition', label: 'Funding Acquisition'},
		];

		return (
			<div style={styles.container}>			

				<Select.Async
					name="form-field-name"
					autoload={false}
					value={this.state.value}
					loadOptions={this.loadOptions}
					placeholder={<span>Add new contributor</span>}
					onChange={this.handleSelectChange} 
					optionComponent={SelectOption}
					valueComponent={SelectValue}/>

				<div className={'button'} style={[styles.submitButton, (this.state.value && this.state.value.id) && styles.submitButtonActive]} onClick={this.addContributor}>Add Contributor</div>
					
				<h3>Contributors</h3>
				{
					contributorsData.sort((foo, bar)=>{
						// Sort so that alphabetical
						if (foo.source.name > bar.source.name) { return 1; }
						if (foo.source.name < bar.source.name) { return -1; }
						return 0;
					}).map((item, index)=>{
						const buttons = [ 
							{ type: 'button', text: 'Delete', action: this.deleteAdmin.bind(this, item._id) },
						];
						return (
							<PreviewCard 
								key={'featured-' + index}
								type={'user'}
								image={item.source.image}
								title={item.source.name}
								slug={item.source.username}
								header={
									<RadioGroup name={'contributor type ' + item._id} selectedValue={this.state.contributorStates[item._id].type} onChange={this.handleTypeChange.bind(this, item._id)}>
										<Radio value="contributor" id={'contributor-' + item._id} style={styles.radioInput}/> <label htmlFor={'contributor-' + item._id} style={styles.radioLabel}>Contributor</label>
										<Radio value="reader" id={'reader-' + item._id} style={styles.radioInput}/> <label htmlFor={'reader-' + item._id} style={styles.radioLabel}>Reader</label>
										<Radio value="editor" id={'editor-' + item._id} style={styles.radioInput}/> <label htmlFor={'editor-' + item._id} style={styles.radioLabel}>Editor</label>
										<Radio value="author" id={'author-' + item._id} style={styles.radioInput}/> <label htmlFor={'author-' + item._id} style={styles.radioLabel}>Author</label>
									</RadioGroup>
								} 
								footer={
									<div>
										<Select
											name={'contributorRoles-' + item._id}
											options={roleOptions}
											value={this.state.contributorStates[item._id].roles}
											multi={true}
											placeholder={<span>Specify roles of this contributor</span>}
											onChange={this.handleRoleChange.bind(this, item._id)} />
									</div>
								} 
								buttons={buttons} />
						);
					})
				}
			</div>
		);
	}
});

export default Radium(AtomEditorContributors);

styles = {
	container: {
		minHeight: '400px',
	},
	submitButton: {
		fontSize: '0.9em',
		margin: '1em 0em',
		pointerEvents: 'none',
		opacity: 0.5,
	},
	submitButtonActive: {
		pointerEvents: 'auto',
		opacity: 1,
	},
	radioInput: {
		margin: '0em',
	},
	radioLabel: {
		display: 'inline-block',
		fontSize: '0.95em',
		margin: '0em 2em 0em 0em',
	},
};
