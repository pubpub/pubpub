import AtomTypes from 'components/AtomTypes';
import Radium from 'radium';
import React, {PropTypes} from 'react';
import {FormattedMessage} from 'react-intl';
import {globalMessages} from 'utils/globalMessages';
import {safeGetInToJS} from 'utils/safeParse';

export const AtomViewerPane = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string,
		context: PropTypes.oneOf(['reference-list', 'document', 'library']),
	},

	render: function() {
		const props = {
			atomData: this.props.atomData,
			renderType: this.props.renderType || 'full',
			context: this.props.context,
		};
		const type = safeGetInToJS(this.props.atomData, ['atomData', 'type']);

		if (AtomTypes.hasOwnProperty(type)) {
			const Component = AtomTypes[type].viewer;
			return <Component {...props}> {this.props.children} </Component>;

		}
		return (
			<div>
				<FormattedMessage {...globalMessages.UnknownType}/>
			</div>
		);

	}
});

export default Radium(AtomViewerPane);
