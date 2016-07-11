import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard} from 'components';

import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const JrnlProfileFeatured = React.createClass({
	propTypes: {
		jrnlData: PropTypes.object,
	},

	

	render: function() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};
		const metaData = {
			title: 'Featured · ' + jrnlData.jrnlName,
		};

		return (
			<div>
				<Helmet {...metaData} />				

				<PreviewCard 
					image={'http://res.cloudinary.com/pubpub/image/upload/c_limit,h_250,w_250/v1449761714/3eb7882_iavg9s.jpg'}
					title={'Thariq Shihipar'}
					description={'Intent on eating every bagel on earth until I burst.'} 
					buttons = {[ { type: 'button', text: 'Feature', action: ()=>{} }]} />
				
			</div>
		);
	}
});

export default Radium(JrnlProfileFeatured);

styles = {
	
};
