import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard} from 'components';

let styles;

export const AtomFollowers = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	render: function() {
		const followersData = safeGetInToJS(this.props.atomData, ['followersData']) || [];

		return (
			<div>
				{followersData.sort((foo, bar)=>{
					// Sort so that most recent is first in array
					if (foo.createDate > bar.createDate) { return -1; }
					if (foo.createDate < bar.createDate) { return 1; }
					return 0;
				}).map((item, index)=>{
					if (!item.source) { return null; }
					return (<PreviewCard
						key={'featured-' + index}
						type={'user'}
						image={item.source.image}
						title={item.source.name}
						slug={item.source.username}
						description={item.source.bio} />
					);
				})
			}
			</div>
		);
	}
});

export default Radium(AtomFollowers);

styles = {
	
};
