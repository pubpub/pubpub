import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {s3Upload} from 'utils/uploadFile';
import {Loader, CustomizableForm} from 'components';

let styles = {};

export const ReferenceEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
	},

	getInitialState() {
		return {
			referenceData: {
				title: '',
				url: '',
				author: '',
				journal: '',
				volume: '',
				number: '',
				pages: '',
				year: '',
				publisher: '',
				doi: '',
				note: '',	
			},				
			isUploading: false,
		};
	},

	componentWillMount() {
		const referenceData = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content']) || {};
		this.setState({
			referenceData: {
				...this.state.referenceData,
				...referenceData
			}
		});
	},

	getSaveVersionContent: function() {
		return this.state.referenceData;
	},

	inputChange: function(type, evt) {
		this.setState({
			referenceData: {
				...this.state.referenceData,
				[type]: evt.target.value
			}
		});		
	},

	render: function() {
		// const title = safeGetInToJS(this.props.atomEditData, ['atomData', 'title']);
		return (
			<div style={styles.container}>
				
				{Object.keys(this.state.referenceData).map((key, index)=> {
					return (
						<div key={'refernceField-' + index}>
							<label htmlFor={key}>
								{key}
							</label>
							<input ref={key} id={key} name={key} type="text" style={styles.input} value={this.state.referenceData[key]} onChange={this.inputChange.bind(this, key)}/>
						</div>
					);
				})}

			</div>
		);
	}
});

export default Radium(ReferenceEditor);

styles = {
	container: {
		padding: '2em 0em',
		maxWidth: '600px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			maxWidth: 'auto',
		},
	},
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
};
