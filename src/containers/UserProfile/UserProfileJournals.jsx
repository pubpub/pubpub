import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard} from 'components';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

export const UserProfileJournals = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		ownProfile: PropTypes.bool,
	},

	getInitialState: function() {
		return {
			
		};
	},

	render: function() {
		const jrnlsData = safeGetInToJS(this.props.profileData, ['profileData', 'jrnls']) || [];
		
		return (
			<div className={'firstChildNoTopMargin'}>
				{
					jrnlsData.sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.createDate > bar.createDate) { return -1; }
						if (foo.createDate < bar.createDate) { return 1; }
						return 0;
					}).map((item, index)=>{
						if (!item.destination) { return null; }
						return (
							<PreviewCard 
								key={'featured-' + index}
								type={'journal'}
								image={item.destination.icon}
								title={item.destination.jrnlName}
								slug={item.destination.slug}
								description={item.destination.description} />
						);
					})
				}

			</div>
		);
	}
});

export default Radium(UserProfileJournals);
