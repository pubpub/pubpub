import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LayoutEditorInsert from 'components/LayoutEditorInsert/LayoutEditorInsert';
import LayoutEditorPubs from 'components/LayoutEditorPubs/LayoutEditorPubs';
import { generateHash } from 'utilities';

// require('./avatar.scss');

const propTypes = {
	onSave: PropTypes.func,
	initialLayout: PropTypes.array,
};

const defaultProps = {
	onSave: ()=>{},
	initialLayout: [],
};

class LayoutEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			layout: props.initialLayout,
		};
		this.handleInsert = this.handleInsert.bind(this);
		this.getComponentFromType = this.getComponentFromType.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	getComponentFromType(item, index) {
		if (item.type === 'pubs') {
			return (
				<LayoutEditorPubs
					key={`item-${item.id}`}
					onChange={this.handleChange}
					onRemove={this.handleRemove}
					layoutIndex={index}
					content={item.content}
				/>
			);
		}
		if (item.type === 'text') {
			return <div key={`item-${item.id}`}>text {item.id}</div>;
		}
		if (item.type === 'html') {
			return <div key={`item-${item.id}`}>html {item.id}</div>;
		}
		return null;
	}

	handleInsert(index, type) {
		const newLayout = this.state.layout;
		const defaultContents = {
			pubs: {
				title: '',
				size: 'small',
				limit: 0,
				pubIds: [],
			},
			text: {
				contentJSON: {},
			}
		};
		newLayout.splice(index, 0, {
			id: generateHash(8),
			type: type,
			content: defaultContents[type],
		});
		this.setState({ layout: newLayout });
	}
	handleChange(index, newContent) {
		const newLayout = this.state.layout;
		newLayout[index].content = newContent;
		this.setState({ layout: newLayout });
	}
	handleRemove(index) {
		const newLayout = this.state.layout;
		newLayout.splice(index, 1);
		this.setState({ layout: newLayout });
	}

	render() {
		return (
			<div>
				<LayoutEditorInsert insertIndex={0} onInsert={this.handleInsert} />
				{this.state.layout.map((item, index)=> {
					const editorTypeComponent = this.getComponentFromType(item, index);
					if (!editorTypeComponent) { return null; }
					return [
						editorTypeComponent,
						<LayoutEditorInsert key={`insert-${item.id}`} insertIndex={index + 1} onInsert={this.handleInsert} />
					];
				})}
			</div>
		);
	}
}

LayoutEditor.defaultProps = defaultProps;
LayoutEditor.propTypes = propTypes;
export default LayoutEditor;
