import React, {PropTypes} from 'react';
import Radium from 'radium';
import AtomTypes from 'components/AtomTypes';
import {safeGetInToJS} from 'utils/safeParse';

export const AtomEditorPane = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
		loginData: PropTypes.object,
	},

	render: function() {
		const props = {
			ref: 'editor',
			atomEditData: this.props.atomEditData,
			loginData: this.props.loginData
		};

		const type = safeGetInToJS(this.props.atomEditData, ['atomData', 'type']);
		if (AtomTypes.hasOwnProperty(type)) {
			const Component = AtomTypes[type].editor;
			return <Component {...props} />;
		}
		
		return <div>Unknown Type</div>;
		
	}
});

export default Radium(AtomEditorPane);
