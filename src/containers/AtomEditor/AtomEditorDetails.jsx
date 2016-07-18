import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

let styles = {};

export const AtomEditorDetails = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
		updateDetailsHandler: PropTypes.func,
		isLoading: PropTypes.bool,
	},

	getInitialState() {
		return {
			title: '',
			slug: '',
			description: '',
			previewImage: '',
		};
	},

	componentWillMount() {
		const atomData = safeGetInToJS(this.props.atomEditData, ['atomData']) || {};
		this.setState({
			title: atomData.title || '',
			slug: atomData.slug || '',
			description: atomData.description || '',
			previewImage: atomData.previewImage || '',
		});
	},

	updateDetails: function(evt) {
		evt.preventDefault();
		const newDetails = {
			title: this.state.title,
			slug: this.state.slug,
			description: this.state.description,
			previewImage: this.state.previewImage,
		};
		this.props.updateDetailsHandler(newDetails);
	},

	render: function() {
		console.log(this.props);
		return (
			<div>
				<h2>Details</h2>
				
			</div>
		);
	}
});

export default Radium(AtomEditorDetails);

styles = {
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
};
