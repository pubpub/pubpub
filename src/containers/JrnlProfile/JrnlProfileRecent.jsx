import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard} from 'components';

// import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

export const JrnlProfileRecent = React.createClass({
	propTypes: {
		jrnlData: PropTypes.object,
	},

	render: function() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};
		const atomsData = safeGetInToJS(this.props.jrnlData, ['atomsData']) || [];
		const metaData = {
			title: jrnlData.jrnlName,
		};

		return (
			<div>
				<Helmet {...metaData} />				

				{
					atomsData.sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.createDate > bar.createDate) { return -1; }
						if (foo.createDate < bar.createDate) { return 1;}
						return 0;
					}).map((item, index)=>{
						return (
							<PreviewCard 
								key={'featured-' + index}
								type={item.destination.type}
								image={item.destination.previewImage}
								title={item.destination.title}
								slug={item.destination.slug}
								description={item.destination.description} />
						);
					})
				}
				
				
			</div>
		);
	}
});

export default Radium(JrnlProfileRecent);
