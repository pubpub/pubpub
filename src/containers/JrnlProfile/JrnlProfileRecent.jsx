import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

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
				
				<h3>Here's that recent stuff</h3>
				
			</div>
		);
	}
});

export default Radium(JrnlProfileRecent);

styles = {
	
};
