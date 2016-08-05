import React, {PropTypes} from 'react';
import Radium from 'radium';
import {PreviewCard} from 'components';
import dateFormat from 'dateformat';
import Select from 'react-select';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

export const UserProfilePubs = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		ownProfile: PropTypes.bool,
		filters: PropTypes.string
	},

	getInitialState: function() {
		return {
			filters: []
		};
	},

	handleFilterChange: function(filters) {
		this.setState({filters: filters});
	},
	// doing this asynchronously (loadOptions) instead of options because
	// in the future we will be pulling tags from DB with a call
	loadOptions: function(a, callback) {
		const one = {
			value: 'published',
			label: 'published',
			id: 0
		};
		const two = {
			value: 'unpublished',
			label: 'unpublished',
			id: 0
		};
		callback(null, { options: [one, two] })
	},
	render: function() {
		const profileData = this.props.profileData || {};
		const atoms = profileData.atoms || [];

		return (
			<div className={'firstChildNoTopMargin'}>
				{this.props.ownProfile &&
					<Select.Async
						name="form-field-filter"
						minimumInput={1}
						value={this.state.filters}
						loadOptions={this.loadOptions}
						multi={true}
						placeholder={<span>Add a filter</span>}
						onChange={this.handleFilterChange} />
				}

				{
					atoms.filter((item)=>{
						return item.type === 'document' && item.title.indexOf('Reply:') === -1;
					}).sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.lastUpdated > bar.lastUpdated) { return -1; }
						if (foo.lastUpdated < bar.lastUpdated) { return 1; }
						return 0;
					}).map((item, index)=>{

						// Need to check to make sure we don't put the
						// edit button on read-only pubs
						const buttons = [
							{ type: 'link', text: 'Edit', link: '/pub/' + item.slug + '/edit' },
						];


						if (this.state.filters.length) {
							for (let ii = 0; ii < this.state.filters.length; ii++) {
								if (this.state.filters[ii].value === 'published' && !item.isPublished) {
									return;
								}
								if (this.state.filters[ii].value === 'unpublished' && item.isPublished) {
									return;
								}
							}
						}

						return (
							<PreviewCard
								key={'atomItem-' + index}
								type={'atom'}
								slug={item.slug}
								title={item.title}
								image={item.previewImage}
								description={item.description}
								header={ <div>{item.isPublished ? 'Published' : 'Unpublished'}</div> }
								footer={ <div>{item.versions.length} Version{item.versions.length !== 1 && 's'} | {item.lastUpdated ? 'Latest Version: ' + dateFormat(item.lastUpdated, 'mmm dd, yyyy') : 'Created: ' + dateFormat(item.createDate, 'mmm dd, yyyy')}</div> }
								buttons = {this.props.ownProfile ? buttons : []} />
						);
					})
				}


			</div>
		);
	}
});

export default Radium(UserProfilePubs);
