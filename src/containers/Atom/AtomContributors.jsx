import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import Select from 'react-select';
import request from 'superagent';
import {PreviewCard, SelectValue, SelectOption} from 'components';
import {RadioGroup, Radio} from 'utils/ReactRadioGroup';

import {FormattedMessage} from 'react-intl';
import {globalMessages} from 'utils/globalMessages';

let styles;

export const AtomContributors = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		contributorsData: PropTypes.array,
		handleAddContributor: PropTypes.func,
		handleUpdateContributor: PropTypes.func,
		handleDeleteContributor: PropTypes.func,
		isLoading: PropTypes.bool,
		error: PropTypes.bool,
		permissionType: PropTypes.string,
	},

	getInitialState: function() {
		return {
			value: null,
			contributorStates: {},
		};
	},

	componentWillMount() {
		const typesObject = {};
		const contributorsData = this.props.contributorsData || [];
		contributorsData.map((item)=> {
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
			const typesObject = {};
			const contributorsData = nextProps.contributorsData || [];
			contributorsData.map((item)=> {
				const roles = item.metadata ? item.metadata.roles : [];
				typesObject[item._id] = {
					type: item.type,
					roles: roles,
				};
			});
			this.setState({
				contributorStates: typesObject,
				value: null
			});
		}
	},

	handleSelectChange: function(value) {
		this.setState({ value });
	},

	loadOptions: function(input, callback) {
		request.get('/api/autocompleteUsers?string=' + input).end((err, response)=>{
			const responseArray = (response && response.body) || [];
			const options = responseArray.map((item)=>{
				return {
					value: item.username,
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
		this.updateContributor(linkID, newType, this.state.contributorStates[linkID].roles);
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
		this.updateContributor(linkID, this.state.contributorStates[linkID].type, roleList);
	},

	updateContributor: function(linkID, type, roles) {
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
			<div >
				{this.props.permissionType === 'author' &&
					<div style={styles.container}>

						<Style rules={{
							'.contributor-role-input .Select-control': { borderWidth: '0px', height: '34px'},
							'.contributor-role-input .Select-placeholder': {lineHeight: '34px'},
						}} />

						<Select.Async
							name="form-field-name"
							// autoload={false}
							minimumInput={3}
							value={this.state.value}
							loadOptions={this.loadOptions}
							placeholder={<span><FormattedMessage id="atomContributors.AddNew" defaultMessage="Add new contributor"/></span>}
							filterOptions={(options)=>{
								return options.filter((option)=>{
									for (let index = 0; index < contributorsData.length; index++) {
										if (contributorsData[index].source.username === option.slug) {
											return false;
										}
									}
									return true;
								});
							}}
							onChange={this.handleSelectChange}
							optionComponent={SelectOption}
							valueComponent={SelectValue}/>

						<div className={'button'} style={[styles.submitButton, (this.state.value && this.state.value.id) && styles.submitButtonActive]} onClick={this.addContributor}>
							<FormattedMessage {...globalMessages.AddContributor}/>
						</div>

						<h3>
							<FormattedMessage {...globalMessages.Contributors}/>
						</h3>
						{
							contributorsData.sort((foo, bar)=>{
								// Sort so that alphabetical
								if (foo.source.name > bar.source.name) { return 1; }
								if (foo.source.name < bar.source.name) { return -1; }
								return 0;
							}).map((item, index)=>{
								const buttons = [
									{ type: 'button', text: <FormattedMessage {...globalMessages.Delete}/>, action: this.deleteAdmin.bind(this, item._id) },
								];
								return (
									<PreviewCard
										key={'contributor-' + item._id}
										type={'user'}
										image={item.source.image}
										title={item.source.name}
										slug={item.source.username}
										description={
											<RadioGroup name={'contributor type ' + item._id} selectedValue={this.state.contributorStates[item._id].type} onChange={this.handleTypeChange.bind(this, item._id)}>
												<Radio value="contributor" id={'contributor-' + item._id} style={styles.radioInput}/> <label htmlFor={'contributor-' + item._id} style={styles.radioLabel}>
													<FormattedMessage {...globalMessages.Contributor}/>
												</label>
												<Radio value="reader" id={'reader-' + item._id} style={styles.radioInput}/> <label htmlFor={'reader-' + item._id} style={styles.radioLabel}>
													<FormattedMessage {...globalMessages.Reader}/>
												</label>
												<Radio value="editor" id={'editor-' + item._id} style={styles.radioInput}/> <label htmlFor={'editor-' + item._id} style={styles.radioLabel}>
													<FormattedMessage {...globalMessages.Editor}/>
												</label>
												<Radio value="author" id={'author-' + item._id} style={styles.radioInput}/> <label htmlFor={'author-' + item._id} style={styles.radioLabel}>
													<FormattedMessage {...globalMessages.Author}/>
												</label>
											</RadioGroup>
										}
										mobileDescription={
											<RadioGroup name={'contributor type 2' + item._id} selectedValue={this.state.contributorStates[item._id].type} onChange={this.handleTypeChange.bind(this, item._id)}>
												<Radio value="contributor" id={'contributor-' + item._id} style={styles.radioInput}/> <label htmlFor={'contributor-' + item._id} style={styles.radioLabel}>
													<FormattedMessage {...globalMessages.Contributor}/>
											</label>
												<Radio value="reader" id={'reader2-' + item._id} style={styles.radioInput}/> <label htmlFor={'reader2-' + item._id} style={styles.radioLabel}>
													<FormattedMessage {...globalMessages.Reader}/>
												</label>
												<Radio value="editor" id={'editor2-' + item._id} style={styles.radioInput}/> <label htmlFor={'editor2-' + item._id} style={styles.radioLabel}>
													<FormattedMessage {...globalMessages.Editor}/>
												</label>
												<Radio value="author" id={'author2-' + item._id} style={styles.radioInput}/> <label htmlFor={'author2-' + item._id} style={styles.radioLabel}>
													<FormattedMessage {...globalMessages.Author}/>
												</label>
											</RadioGroup>
										}
										footer={
											<div className={'contributor-role-input'}>
												<Select
													name={'contributorRoles-' + item._id}
													options={roleOptions}
													value={this.state.contributorStates[item._id].roles}
													multi={true}
													placeholder={<span><FormattedMessage id="atomContributors.SpecifyRoles" defaultMessage="Specify roles of this contributor"/></span>}
													onChange={this.handleRoleChange.bind(this, item._id)} />
											</div>
										}
										buttons={buttons} />
								);
							})
						}
					</div>
				}

				{this.props.permissionType !== 'author' &&
					<div style={styles.container}>
						{
							contributorsData.sort((foo, bar)=>{
								// Sort so that alphabetical
								if (foo.source.name > bar.source.name) { return 1; }
								if (foo.source.name < bar.source.name) { return -1; }
								return 0;
							}).map((item, index)=>{
								const roles = item.metadata && item.metadata.roles || [];
								return (
									<PreviewCard
										key={'contributor-' + item._id}
										type={'user'}
										image={item.source.image}
										title={item.source.name}
										slug={item.source.username}
										description= {<span style={{textTransform: 'capitalize' }}> {item.type}</span>}
										footer={roles.length && roles.map((role, roleIndex)=> {
											return (
												<div key={'role-' + index + '-' + roleIndex} style={styles.role}>
													{role.label}
												</div>
											);
										})} />
								);
							})
						}

					</div>
				}


			</div>
		);
	}
});

export default Radium(AtomContributors);

styles = {
	container: {
		// minHeight: '400px',
		marginTop: '1em',
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


	role: {
		display: 'inline-block',
		padding: '.25em .5em',
		border: '1px solid #BBBDC0',
		margin: '0em .5em 0em 0em',
		fontSize: '0.85em',
	},
};
