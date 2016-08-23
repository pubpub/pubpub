import React, {PropTypes} from 'react';
import Radium from 'radium';
import AtomTypes from 'components/AtomTypes';
import {safeGetInToJS} from 'utils/safeParse';

export const AtomViewerPane = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string,
	},

	render: function() {
		const props = {
			atomData: this.props.atomData,
			renderType: this.props.renderType || 'full',
		};
		const type = safeGetInToJS(this.props.atomData, ['atomData', 'type']);

		if (AtomTypes.hasOwnProperty(type)) {
			const Component = AtomTypes[type].viewer;
			return <Component {...props} />;
			
		}
		return <div>Unknown Type</div>;
	
	}
});

export default Radium(AtomViewerPane);
