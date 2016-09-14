import React, {PropTypes} from 'react';
import Radium from 'radium';
import AtomTypes from 'components/AtomTypes';
import {safeGetInToJS} from 'utils/safeParse';
import {FormattedMessage} from 'react-intl';
import {globalMessages} from 'utils/globalMessages';


export const AtomEditorPane = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		loginData: PropTypes.object,
	},

	render: function() {
		const props = {
			ref: 'editor',
			atomData: this.props.atomData,
			loginData: this.props.loginData
		};

		const type = safeGetInToJS(this.props.atomData, ['atomData', 'type']);
		if (AtomTypes.hasOwnProperty(type)) {
			const Component = AtomTypes[type].editor;
			return <Component {...props} />;
		}

		return (
			<div>
				<FormattedMessage {...globalMessages.UnknownType}/>
			</div>
		);

	}
});

export default Radium(AtomEditorPane);
