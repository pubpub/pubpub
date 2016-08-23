import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {PreviewCard} from 'components';

let styles;

export const AtomContributors = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		contributorsData: PropTypes.array,
	},

	render: function() {
		const contributorsData = this.props.contributorsData || [];
		return (
			<div>
				
				<h2 className={'normalWeight'}>Contributors</h2>
				

			</div>
		);
	}
});

export default Radium(AtomContributors);

styles = {
	role: {
		display: 'inline-block',
		padding: '.25em .5em',
		border: '1px solid #BBBDC0',
		margin: '0em .5em 0em 0em',
		fontSize: '0.85em',
	},
};
