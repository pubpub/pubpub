import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import Select from 'react-select';
import request from 'superagent';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard, SelectValue, SelectOption} from 'components';
import dateFormat from 'dateformat';

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
		};
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

	deleteAdmin: function(contributorID) {
		if (!contributorID) { return undefined; }
		this.props.handleDeleteContributor(contributorID);
	},

	render: function() {
		// const atomData = safeGetInToJS(this.props.atomData, ['atomData']) || {};
		const contributorsData = this.props.contributorsData || [];

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
									<div>
										{item.type}
									</div>
								} 
								footer={
									<div>
										{item.metadata && item.metadata.roles}
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
};
