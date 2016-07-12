import React from 'react';
import Radium from 'radium';
import {Axis} from 'components';
//Calls the axis functions to generate axis.
//Generates settings from inherited lineprops.

const XYAxis = React.createClass({
	render: function() {
		const xSettings = {
			translate: 'translate(0,'+(this.props.height - this.props.heightPadL)+')',
			scale: this.props.xScale,
			orient: 'bottom'
		};
		const ySettings = {
			translate: 'translate('+(this.props.widthPadL)+',0)',
			scale: this.props.yScale,
			orient: 'left'
		};
		return (
			<g className="xy-axis">
				<Axis {...xSettings}/>
				<Axis {...ySettings}/>
			</g>
		);
	}
})

export default Radium(XYAxis);