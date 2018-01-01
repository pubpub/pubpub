import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LayoutEditorInsert from 'components/LayoutEditorInsert/LayoutEditorInsert';
import LayoutEditorPubs from 'components/LayoutEditorPubs/LayoutEditorPubs';
import LayoutEditorText from 'components/LayoutEditorText/LayoutEditorText';
import LayoutEditorHtml from 'components/LayoutEditorHtml/LayoutEditorHtml';
import LayoutEditorDrafts from 'components/LayoutEditorDrafts/LayoutEditorDrafts';
import { generateHash } from 'utilities';

require('./layoutEditor.scss');

const propTypes = {
	onChange: PropTypes.func,
	initialLayout: PropTypes.array.isRequired,
	pubs: PropTypes.array.isRequired,
	isPage: PropTypes.bool,
};

const defaultProps = {
	onChange: ()=>{},
	isPage: false,
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
					pubRenderList={this.state.pubRenderLists[index] || []}
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
			return (
				<LayoutEditorHtml
					key={`item-${item.id}`}
					onChange={this.handleChange}
					onRemove={this.handleRemove}
					layoutIndex={index}
					content={item.content}
				/>
			);
		}
		if (item.type === 'drafts') {
			return (
				<LayoutEditorDrafts
					key={`item-${item.id}`}
					onChange={this.handleChange}
					onRemove={this.handleRemove}
					layoutIndex={index}
					content={item.content}
				/>
			);
		}
		return null;
	}

	handleInsert(index, type) {
		const newLayout = this.state.layout;
		const defaultContents = {
			pubs: {
				title: '',
				size: 'medium',
				limit: 0,
				pubIds: [],
			},
			text: {
				title: '',
				align: 'left',
				width: 'wide',
				text: undefined,
			},
			html: {
				title: '',
				html: '',
			},
			drafts: {
				title: 'Open Drafts'
			},
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
		this.props.onChange(newLayout);
	}
	handleChange(index, newContent) {
		const newLayout = this.state.layout;
		newLayout[index].content = newContent;
		const newPubRenderList = this.generateRenderList(newLayout);
		this.setState({
			layout: newLayout,
			pubRenderLists: newPubRenderList,
		});
		this.props.onChange(newLayout);
	}
	generateRenderList(newLayout) {
		const allPubs = this.props.pubs.filter((item)=> {
			return item.firstPublishedAt;
		}).sort((foo, bar)=> {
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
				for (let pubIndex = renderList.length; pubIndex < limit; pubIndex += 1) {
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
		this.props.onChange(newLayout);
	}

	render() {
		return (
			<div className="layout-editor-component">
				<LayoutEditorInsert
					insertIndex={0}
					onInsert={this.handleInsert}
					isPage={this.props.isPage}
				/>
				{this.state.layout.map((item, index)=> {
					const editorTypeComponent = this.getComponentFromType(item, index);
					if (!editorTypeComponent) { return null; }
					return [
						<div key={`block-${item.id}`} className="component-wrapper">{editorTypeComponent}</div>,
						<LayoutEditorInsert
							key={`insert-${item.id}`}
							insertIndex={index + 1}
							onInsert={this.handleInsert}
							isPage={this.props.isPage}
						/>
					];
				})}
			</div>
		);
	}
}

LayoutEditor.defaultProps = defaultProps;
LayoutEditor.propTypes = propTypes;
export default LayoutEditor;
