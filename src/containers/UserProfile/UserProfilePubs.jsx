import React, {PropTypes} from 'react';
import Radium from 'radium';
import {PreviewCard} from 'components';
import dateFormat from 'dateformat';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

export const UserProfilePubs = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		ownProfile: PropTypes.bool,
	},

	getInitialState: function() {
		return {
			
		};
	},

	render: function() {
		const profileData = this.props.profileData || {};
		const atoms = profileData.atoms || [];
		
		return (
			<div className={'firstChildNoTopMargin'}>
				{
					atoms.filter((item)=>{
						return item.type === 'document';
					}).sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.lastUpdated > bar.lastUpdated) { return -1; }
						if (foo.lastUpdated < bar.lastUpdated) { return 1; }
						return 0;
					}).map((item, index)=>{
						// Need to check to make sure we don't put the 
						// edit button on read-only pubs
						const buttons = [ 
							{ type: 'link', text: 'Edit', link: '/a/' + item.slug + '/edit' },
						];

						return (
							<PreviewCard 
								key={'atomItem-' + index}
								type={'atom'}
								slug={item.slug}
								title={item.title}
								image={item.previewImage}
								description={item.description}
								header={ <div>{item.isPublished ? 'Published' : 'Unpublished'}</div> }
								footer={ <div>{item.versions.length} Version{item.versions.length !== 1 && 's'} | Latest Version: {dateFormat(item.lastUpdated, 'mmm dd, yyyy')}</div> }
								buttons = {this.props.ownProfile ? buttons : []} />
						);
					})
				}


			</div>
		);
	}
});

export default Radium(UserProfilePubs);
