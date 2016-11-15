import AtomViewerPane from 'containers/Atom/AtomViewerPane';
import React, {PropTypes} from 'react';
import {ensureImmutable} from 'reducers';
// import {safeGetInToJS} from 'utils/safeParse';

export const Pointer = React.createClass({
	propTypes: {
		figureName: PropTypes.string,
		referenceType: PropTypes.oneOf(['embed', 'header', 'reference']),
    selectionFunc: PropTypes.function,
    editing: PropTypes.bool,
	},
	getDefaultProps: function() {
		return {
		};
	},
	componentDidMount: function() {
		// console.log('Mounted atom!');
	},

	componentWillUnmount: function() {
		// console.log('unmounted atom!');
	},


	render: function() {
		const data = this.props.data || {};
		// Data is the version object with a populated parent field.
		// The parent field is the atomData field

		return (
			<div style={{display: 'inline-block'}}>
				Figure: {this.props.figureName}
			</div>
		);
	}
});

export default Pointer;
