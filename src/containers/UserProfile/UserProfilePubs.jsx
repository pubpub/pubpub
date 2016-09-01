import React, {PropTypes} from 'react';
import Radium from 'radium';
import {PreviewCard} from 'components';
import dateFormat from 'dateformat';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

export const UserProfilePubs = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		featuredAtoms: PropTypes.array,
		ownProfile: PropTypes.bool,
	},

	getInitialState: function() {
		return {

		};
	},

	render: function() {
		const profileData = this.props.profileData || {};
		const atoms = profileData.atoms || [];
		const featuredAtoms = profileData.featuredAtoms || [];

		return (
			<div className={'firstChildNoTopMargin'}>
				{
					atoms.filter((item)=>{
						// return item.type === 'document' && item.title.indexOf('Reply:') === -1;
						return featuredAtoms.includes(item._id);
					}).sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.lastUpdated > bar.lastUpdated) { return -1; }
						if (foo.lastUpdated < bar.lastUpdated) { return 1; }
						return 0;
					}).map((item, index)=>{
						// Need to check to make sure we don't put the
						// edit button on read-only pubs
						const buttons = [
							{ type: 'link', text: <FormattedMessage {...globalMessages.Edit}/>, link: '/pub/' + item.slug + '/edit' },
						];

						return (
							<PreviewCard
								key={'atomItem-' + index}
								type={'atom'}
								slug={item.slug}
								title={item.title}
								image={item.previewImage}
								description={item.description}
								header={ <div>{item.isPublished ? <FormattedMessage {...globalMessages.Published}/> : <FormattedMessage {...globalMessages.Unpublished}/>}</div> }
								footer={ <div>{item.versions.length} <FormattedMessage {...globalMessages.Versions}/> | {item.lastUpdated ? <span><FormattedMessage {...globalMessages.LatestVersion}/><span> </span> {dateFormat(item.lastUpdated, 'mmm dd, yyyy')}</span> : <span><FormattedMessage {...globalMessages.Created}/><span> </span> {dateFormat(item.createDate, 'mmm dd, yyyy')}</span>}</div>}
								buttons= {this.props.ownProfile ? buttons : []} />
						);
					})
				}


			</div>
		);
	}
});

export default Radium(UserProfilePubs);
