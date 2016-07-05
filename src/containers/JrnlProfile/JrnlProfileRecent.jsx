import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard} from 'components';

import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const JrnlProfileRecent = React.createClass({
	propTypes: {
		jrnlData: PropTypes.object,
	},

	

	render: function() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};

		return (
			<div>
				
				<PreviewCard 
					image={'http://res.cloudinary.com/pubpub/image/upload/c_limit,h_250,w_250/v1449761714/3eb7882_iavg9s.jpg'}
					title={'Thariq Shihipar'}
					description={'Intent on eating every bagel on earth until I burst.'} />
				<PreviewCard 
					image={'http://res.cloudinary.com/pubpub/image/upload/c_limit,h_250,w_250/v1449761714/3eb7882_iavg9s.jpg'}
					title={'Thariq Shihipar'}
					description={'Intent on eating every bagel on earth until I burst.'} />
				<PreviewCard 
					image={'http://res.cloudinary.com/pubpub/image/upload/c_limit,h_250,w_250/v1449761714/3eb7882_iavg9s.jpg'}
					title={'Thariq Shihipar'}
					description={'Intent on eating every bagel on earth until I burst.'} />
				<PreviewCard 
					image={'http://res.cloudinary.com/pubpub/image/upload/c_limit,h_250,w_250/v1449761714/3eb7882_iavg9s.jpg'}
					title={'Thariq Shihipar'}
					description={'Intent on eating every bagel on earth until I burst.'} />
				
			</div>
		);
	}
});

export default Radium(JrnlProfileRecent);

styles = {
	
};
