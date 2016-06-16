import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Markdown, SelectionPopup, License} from 'components';

export const PubBody = React.createClass({
	propTypes: {
		status: PropTypes.string,
		markdown: PropTypes.string,
		addSelectionHandler: PropTypes.func,
		styleScoped: PropTypes.string,
		isPublished: PropTypes.bool,
	},

	componentDidMount() {
		document.getElementById('dynamicStyle').innerHTML = this.props.styleScoped;
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.styleScoped !== nextProps.styleScoped) {
			document.getElementById('dynamicStyle').innerHTML = nextProps.styleScoped;
		}
		if (!nextProps.styleScoped) {
			document.getElementById('dynamicStyle').innerHTML = '';
		}
	},

	
	render: function() {
		return (
			<div id="pub-body"> {/* Highlights are dependent on the id 'pub-body'. See SelectionPopup.jsx */}
				<Markdown mode="html" markdown={this.props.markdown} />

				{this.props.addSelectionHandler &&
					<SelectionPopup addSelectionHandler={this.props.addSelectionHandler}/>
				}
				{this.props.isPublished &&
					<div id="pub-license"><License /></div>
				}
			</div>
		);
	}
});

export default Radium(PubBody);
