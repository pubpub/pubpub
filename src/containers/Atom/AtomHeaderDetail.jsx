import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';

let styles = {};

export const AtomHeaderDetail = React.createClass({
	propTypes: {
		label: PropTypes.node,
		defaultMessage: PropTypes.object,
		editMessage: PropTypes.object,
		activeMessage: PropTypes.object,
		child: PropTypes.object,
		canEdit: PropTypes.bool,
	},

	getInitialState() {
		return {
			showChild: false
		};
	},

	toggleShow: function() {
		this.setState({showChild: !this.state.showChild});	
	},

	render: function() {
		return (
			<div>
				{this.props.label}
				{!this.state.showChild
					? <span className={'underlineOnHover'} onClick={this.toggleShow} style={styles.detail}>
						{this.props.defaultMessage}
						{this.props.defaultMessage && this.props.editMessage && this.props.canEdit && 
							<span> - </span>
						}
						{this.props.canEdit && this.props.editMessage}
					</span>
					: <span className={'underlineOnHover'} onClick={this.toggleShow} style={styles.detail}>
						{this.props.activeMessage}
					</span>
				}
				

				{this.state.showChild && 
					<div style={styles.childWrapper}>{this.props.child}</div>
				}
			</div>
		);
	}
});

export default Radium(AtomHeaderDetail);

styles = {
	detail: {
		padding: '0em 1em',
		color: '#808284',
		fontFamily: '"Open Sans", Helvetica Neue, Arial, sans-serif',
		cursor: 'pointer',
		userSelect: 'none',
		fontSize: '0.85em',
		lineHeight: '1.25em',
	},
	childWrapper: {
		padding: '1em 2em',
		margin: '.5em 0em',
		backgroundColor: '#F3F3F4',
	},
};
