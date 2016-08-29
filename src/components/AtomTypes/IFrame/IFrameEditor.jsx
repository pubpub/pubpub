import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {Loader, CustomizableForm} from 'components';

let styles = {};
const defaultHeight = '300';
const defaultWidth = '100%';

export const IFrameEditor = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	getInitialState() {
		return {
			source: '',
			height: defaultHeight,
			width: defaultWidth
		};
	},

	componentWillMount() {
		const height = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'height']) || defaultHeight;
		const width = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'width']) || defaultWidth;
		const source = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'source']) || '';
		this.setState({source, width, height});
	},
	getSaveVersionContent() {
		const {source, height, width} = this.state;
		return {source, height, width};
	},
	updateData(prop) {
		return evt => this.setState({[prop]: evt.target.value});
	},
	render() {
		const {height, width, source} = this.state;
		return (
			<div>
				<div>
					<h3>Source</h3>
					<input type="text" value={source} onChange={this.updateData('source')}/>
				</div>
				<div>
					<h3>Height</h3>
					<input type="text" value={height} onChange={this.updateData('height')}/>
				</div>
				<div>
					<h3>Width</h3>
					<input type="text" value={width} onChange={this.updateData('width')}/>
				</div>
				<h3>Preview</h3>
				<iframe src={source} style={styles.iframe(height, width)}></iframe>
				<a href={source} alt={'View Source'} target="_blank" className={'underlineOnHover'} style={styles.sourceLink}>View Source</a>
			</div>
		);
	}
});

export default Radium(IFrameEditor);

styles = {
	sourceLink: {
		display: 'table-cell',
		color: 'inherit',
		textDecoration: 'none',
		fontSize: '0.9em',
	},
	iframe: (height, width) => ({height, width})
};
