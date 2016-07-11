import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard} from 'components';

import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const JrnlProfileSubmitted = React.createClass({
	propTypes: {
		jrnlData: PropTypes.object,
	},

	

	render: function() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};
		const submittedData = safeGetInToJS(this.props.jrnlData, ['submittedData']) || {};
		const metaData = {
			title: 'Submitted · ' + jrnlData.jrnlName,
		};

		return (
			<div>
				<Helmet {...metaData} />				

				{
					submittedData.sort((a,b)=>{
						// Sort so that most recent is first in array
						if (a.createDate > b.createDate) { return -1; }
						if (a.createDate < b.createDate) { return 1;}
						return 0;
					}).map((item, index)=>{
						return (
							<PreviewCard 
								key={'submitted-' + index}
								type={'atom'}
								image={item.source.previewImage}
								slug={item.source.slug}
								title={item.source.title}
								description={item.source.description} 
								header={<div>Submitted on {item.createDate}</div>}
								buttons = {[ { type: 'button', text: 'Feature', action: ()=>{} }]}/>
						);
					})
				}
				
			</div>
		);
	}
});

export default Radium(JrnlProfileSubmitted);

styles = {
	
};
