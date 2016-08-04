import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {PreviewCard} from 'components';
import {safeGetInToJS} from 'utils/safeParse';


export const AtomReaderFollowers = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	render: function() {
		const atomData = safeGetInToJS(this.props.atomData, ['atomData']) || {};
		const followersData = safeGetInToJS(this.props.atomData, ['followersData']) || [];
		const metaData = {
			title: 'Analytics · ' + atomData.title,
		};

		return (
			<div>
				<Helmet {...metaData} />
				<h2 className={'normalWeight'}>Analytics</h2>

				{
					followersData.sort((foo, bar)=>{
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

export default Radium(AtomReaderFollowers);
