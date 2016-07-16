import React, {PropTypes} from 'react';
import Radium from 'radium';
import {PreviewCard} from 'components';

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
			<div>
				{
					atoms.sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.lastUpdated > bar.lastUpdated) { return -1; }
						if (foo.lastUpdated < bar.lastUpdated) { return 1;}
						return 0;
					}).map((item, index)=>{
						return (
							<PreviewCard 
								key={'atomItem-' + index}
								type={'atom'}
								slug={item.slug}
								title={item.title}
								image={item.image}
								description={item.description}
								showEdit={this.props.ownProfile === 'self' ? true : false} />
						);
					})
				}


			</div>
		);
	}
});

export default Radium(UserProfilePubs);
