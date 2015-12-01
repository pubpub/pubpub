import React, { PropTypes } from 'react';
import Radium from 'radium';
import {baseStyles} from './pubModalStyle';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubModalSource = React.createClass({
	propTypes: {
		markdown: PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			markdown: '',
		};
	},

	render: function() {
		return (
			<div style={baseStyles.pubModalContainer}>

				<div style={baseStyles.pubModalTitle}>Source</div>
				<div style={baseStyles.pubModalContentWrapper}>
					<div style={styles.sourceText} spellCheck="false">{this.props.markdown}</div>
				</div>
				

			</div>
		);
	}
});

export default Radium(PubModalSource);

styles = {
	sourceText: {
		fontFamily: 'Courier',
		fontSize: '15px',
		padding: 0,
		margin: 0,
		borderWidth: 0,
		whiteSpace: 'pre-wrap',
		outline: 'none',
	}
};
