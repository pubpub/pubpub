import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard} from 'components';

export const UserProfileFollowers = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
	},

	getInitialState: function() {
		return {

		};
	},

	render: function() {
		const followersData = safeGetInToJS(this.props.profileData, ['profileData', 'followers']) || [];

		return (
			<div className={'firstChildNoTopMargin'}>
        <h3>Followers</h3>

				{
					followersData.sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.createDate > bar.createDate) { return -1; }
						if (foo.createDate < bar.createDate) { return 1; }
						return 0;
					}).map((item, index)=>{
						if (!item.destination) { return null; }
						return (
							<PreviewCard
								key={'featured-' + index}
								type={'user'}
								image={item.source.image}
								title={item.source.username}
								slug={item.source.slug}
								description={item.source.description} />
						);
					})
				}

			</div>
		);
	}
});

export default Radium(UserProfileFollowers);
