import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

export const AtomHeaderDetailsMulti = React.createClass({
	propTypes: {
		labels: PropTypes.array,
		activeMessages: PropTypes.array,
		views: PropTypes.array,
		canEdit: PropTypes.bool,
	},

	getInitialState() {
		return {
			showView: undefined
		};
	},

	toggleShow: function(index) {
		if (index === this.state.showView) {
			this.setState({showView: undefined});	
		} else {
			this.setState({showView: index});	
		}
	},

	render: function() {
		const labels = this.props.labels || [];
		const activeMessages = this.props.activeMessages || [];
		const views = this.props.views || [];
		return (
			<span>
				{labels.map((label, index)=>{
					const message = index === this.state.showView ? activeMessages[index] : labels[index];
					return (
						<span key={'multi-option-' + index} style={styles.label} className={'underlineOnHover'} onClick={this.toggleShow.bind(this, index)}>
							{message}
						</span>
					);
				})}

				{this.state.showView !== undefined && 
					<div style={styles.childWrapper}>{views[this.state.showView]}</div>
				}
			</span>
		);
	}
});

export default Radium(AtomHeaderDetailsMulti);

styles = {
	label: {
		fontSize: '0.85em',
		padding: '0em 1em 0em .5em',
		cursor: 'pointer',
	},
	childWrapper: {
		padding: '1em 2em',
		margin: '.5em 0em',
		backgroundColor: '#F3F3F4',
	},
};
