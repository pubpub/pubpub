import AtomTypes from 'components/AtomTypes';
import Radium from 'radium';
import React, {PropTypes} from 'react';
import {FormattedMessage} from 'react-intl';
import {globalMessages} from 'utils/globalMessages';
import {safeGetInToJS} from 'utils/safeParse';

export const AtomEditorPane = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		loginData: PropTypes.object,
	},

	getSaveVersionContent: function() {
		return this.refs.editor.getSaveVersionContent();
	},

	render: function() {
		const props = {
			atomData: this.props.atomData,
			loginData: this.props.loginData
		};

		const type = safeGetInToJS(this.props.atomData, ['atomData', 'type']);
		if (AtomTypes.hasOwnProperty(type)) {
			const Component = AtomTypes[type].editor;
			return <Component ref="editor" {...props} />;
		}

		return (
			<div>
				<FormattedMessage {...globalMessages.UnknownType}/>
			</div>
		);

	}
});

export default Radium(AtomEditorPane);
