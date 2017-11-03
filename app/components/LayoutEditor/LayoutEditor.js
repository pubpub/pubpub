import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LayoutEditorInsert from 'components/LayoutEditorInsert/LayoutEditorInsert';
import LayoutEditorPubs from 'components/LayoutEditorPubs/LayoutEditorPubs';
import LayoutEditorText from 'components/LayoutEditorText/LayoutEditorText';
import { generateHash } from 'utilities';

require('./layoutEditor.scss');

const propTypes = {
	onSave: PropTypes.func,
	initialLayout: PropTypes.array,
	pubs: PropTypes.array.isRequired,
};

const defaultProps = {
	onSave: ()=>{},
	initialLayout: [],
};

class LayoutEditor extends Component {
	constructor(props) {
		super(props);
		this.generateRenderList = this.generateRenderList.bind(this);
		this.state = {
			layout: props.initialLayout,
			pubRenderLists: this.generateRenderList(props.initialLayout),
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
					pubRenderList={this.state.pubRenderLists[index]}
					pubs={this.props.pubs}
				/>
			);
		}
		if (item.type === 'text') {
			return (
				<LayoutEditorText
					key={`item-${item.id}`}
					onChange={this.handleChange}
					onRemove={this.handleRemove}
					layoutIndex={index}
					content={item.content}
				/>
			);
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
				title: '',
				align: 'left',
				width: 'wide',
				text: undefined,
			}
		};
		newLayout.splice(index, 0, {
			id: generateHash(8),
			type: type,
			content: defaultContents[type],
		});
		const newPubRenderList = this.generateRenderList(newLayout);
		this.setState({
			layout: newLayout,
			pubRenderLists: newPubRenderList,
		});
	}
	handleChange(index, newContent) {
		const newLayout = this.state.layout;
		newLayout[index].content = newContent;
		const newPubRenderList = this.generateRenderList(newLayout);
		this.setState({
			layout: newLayout,
			pubRenderLists: newPubRenderList,
		});
	}
	generateRenderList(newLayout) {
		const allPubs = this.props.pubs.sort((foo, bar)=> {
			if (foo.firstPublishedAt < bar.firstPublishedAt) { return 1; }
			if (foo.firstPublishedAt > bar.firstPublishedAt) { return -1; }
			return 0;
		});
		const nonSpecifiedPubs = [...allPubs];
		const pubRenderLists = {};
		newLayout.forEach((block)=> {
			if (block.type === 'pubs') {
				const specifiedPubs = block.content.pubIds;
				nonSpecifiedPubs.forEach((pub, index)=> {
					if (specifiedPubs.indexOf(pub.id) > -1) {
						nonSpecifiedPubs.splice(index, 1);
					}
				});
			}
		});
		// ead5a604-d8b0-4dec-837b-fcdff88264f1
		newLayout.forEach((block, index)=> {
			if (block.type === 'pubs') {
				
				
				const pubsById = this.props.pubs.reduce((prev, curr)=> {
					const output = prev;
					output[curr.id] = curr;
					return output;
				}, {});
				const renderList = block.content.pubIds.map((id)=> {
					return pubsById[id];
				});
				const limit = block.content.limit || (nonSpecifiedPubs.length + renderList.length);
				for (let pubIndex = renderList.length; pubIndex < limit; pubIndex++) {
					if (nonSpecifiedPubs.length) {
						renderList.push(nonSpecifiedPubs[0]);
						nonSpecifiedPubs.splice(0, 1);
					}
				}
				pubRenderLists[index] = renderList;
			}
		});
		return pubRenderLists;
	}
	handleRemove(index) {
		const newLayout = this.state.layout;
		newLayout.splice(index, 1);
		this.setState({ layout: newLayout });
	}

	render() {
		console.log('--------')
		return (
			<div className={'layout-editor'}>
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
