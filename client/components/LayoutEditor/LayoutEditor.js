import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LayoutEditorInsert from 'components/LayoutEditorInsert/LayoutEditorInsert';
import LayoutEditorPubs from 'components/LayoutEditorPubs/LayoutEditorPubs';
import LayoutEditorText from 'components/LayoutEditorText/LayoutEditorText';
import LayoutEditorHtml from 'components/LayoutEditorHtml/LayoutEditorHtml';
// import LayoutEditorDrafts from 'components/LayoutEditorDrafts/LayoutEditorDrafts';
import { generateHash, generateRenderLists } from 'utilities';

require('./layoutEditor.scss');

const propTypes = {
	onChange: PropTypes.func.isRequired,
	initialLayout: PropTypes.array.isRequired,
	pubs: PropTypes.array.isRequired,
	communityData: PropTypes.object.isRequired,
	// isPage: PropTypes.bool,
};

// const defaultProps = {
// 	onChange: ()=>{},
// 	// isPage: false,
// };

class LayoutEditor extends Component {
	constructor(props) {
		super(props);
		// generateRenderLists = generateRenderLists.bind(this);
		this.state = {
			layout: props.initialLayout,
			pubRenderLists: generateRenderLists(props.initialLayout, props.pubs),
		};
		this.handleInsert = this.handleInsert.bind(this);
		// this.getComponentFromType = this.getComponentFromType.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		// generateRenderLists = generateRenderLists.bind(this);
	}

	// getComponentFromType(item, index) {
	// 	if (item.type === 'pubs') {
	// 		return (
	// 			<LayoutEditorPubs
	// 				key={`item-${item.id}`}
	// 				onChange={this.handleChange}
	// 				onRemove={this.handleRemove}
	// 				layoutIndex={index}
	// 				content={item.content}
	// 				pubRenderList={this.state.pubRenderLists[index] || []}
	// 				pubs={this.props.pubs}
	// 			/>
	// 		);
	// 	}
	// 	if (item.type === 'text') {
	// 		return (
	// 			<LayoutEditorText
	// 				key={`item-${item.id}`}
	// 				onChange={this.handleChange}
	// 				onRemove={this.handleRemove}
	// 				layoutIndex={index}
	// 				content={item.content}
	// 			/>
	// 		);
	// 	}
	// 	if (item.type === 'html') {
	// 		return (
	// 			<LayoutEditorHtml
	// 				key={`item-${item.id}`}
	// 				onChange={this.handleChange}
	// 				onRemove={this.handleRemove}
	// 				layoutIndex={index}
	// 				content={item.content}
	// 			/>
	// 		);
	// 	}
	// 	// if (item.type === 'drafts') {
	// 	// 	return (
	// 	// 		<LayoutEditorDrafts
	// 	// 			key={`item-${item.id}`}
	// 	// 			onChange={this.handleChange}
	// 	// 			onRemove={this.handleRemove}
	// 	// 			layoutIndex={index}
	// 	// 			content={item.content}
	// 	// 		/>
	// 	// 	);
	// 	// }
	// 	return null;
	// }

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
			// drafts: {
			// 	title: 'Open Drafts'
			// },
		};
		newLayout.splice(index, 0, {
			id: generateHash(8),
			type: type,
			content: defaultContents[type],
		});
		const newPubRenderList = generateRenderLists(newLayout, this.props.pubs);
		this.setState({
			layout: newLayout,
			pubRenderLists: newPubRenderList,
		});
		this.props.onChange(newLayout);
	}

	handleChange(index, newContent) {
		const newLayout = this.state.layout;
		newLayout[index].content = newContent;
		const newPubRenderList = generateRenderLists(newLayout, this.props.pubs);
		this.setState({
			layout: newLayout,
			pubRenderLists: newPubRenderList,
		});
		this.props.onChange(newLayout);
	}

	handleRemove(index) {
		const newLayout = this.state.layout;
		newLayout.splice(index, 1);
		this.setState({ layout: newLayout });
		this.props.onChange(newLayout);
	}

	// generateRenderList(newLayout) {
	// 	const allPubs = this.props.pubs.sort((foo, bar)=> {
	// 		/* Sort by activeVersion date - or date of pub creation */
	// 		/* when there are no saved versions */
	// 		const fooDate = foo.activeVersion.createdAt || foo.createdAt;
	// 		const barDate = bar.activeVersion.createdAt || bar.createdAt;
	// 		if (fooDate < barDate) { return 1; }
	// 		if (fooDate > barDate) { return -1; }
	// 		return 0;
	// 	});

	// 	/* nonSpecifiedPubs is used to keep track of which pubs should flow */
	// 	/* when looking to fill a slot that has not been specifically */
	// 	/* assigned to a given pub */
	// 	let nonSpecifiedPubs = [...allPubs];

	// 	/* Iterate over each block and remove specified pubs from the */
	// 	/* list of nonSpecifiedPubs. */
	// 	newLayout.forEach((block)=> {
	// 		if (block.type === 'pubs') {
	// 			const specifiedPubs = block.content.pubIds;
	// 			nonSpecifiedPubs = nonSpecifiedPubs.filter((pub)=> {
	// 				return specifiedPubs.indexOf(pub.id) > -1;
	// 			});
	// 			// nonSpecifiedPubs.forEach((pub, index)=> {
	// 			// 	if (specifiedPubs.indexOf(pub.id) > -1) {
	// 			// 		nonSpecifiedPubs.splice(index, 1);
	// 			// 	}
	// 			// });
	// 		}
	// 	});

	// 	/* pubRenderLists holds the list of pubs to be rendered in each block */
	// 	const pubRenderLists = {};

	// 	/* Iterate over each block and generate the renderList for that block */
	// 	newLayout.forEach((block, index)=> {
	// 		if (block.type === 'pubs') {
	// 			const pubsById = {};
	// 			this.props.pubs.forEach((prev, curr)=> {
	// 				pubsById[curr.id] = curr;
	// 			});

	// 			/* First add the specified pubs for a given block to the renderList */
	// 			const renderList = block.content.pubIds.map((id)=> {
	// 				return pubsById[id];
	// 			});


	// 			const limit = block.content.limit || (nonSpecifiedPubs.length + renderList.length);

	// 			for (let pubIndex = renderList.length; pubIndex < limit; pubIndex += 1) {
	// 				// if (nonSpecifiedPubs.length) {
	// 				renderList.push(nonSpecifiedPubs[0]);
	// 				nonSpecifiedPubs.splice(0, 1);
	// 				// }
	// 			}

	// 			pubRenderLists[index] = renderList.filter((pub)=> {
	// 				if (!block.content.tagId) { return true; }
	// 				return pub.pubTags.reduce((prev, curr)=> {
	// 					if (curr.tagId === block.content.tagId) { return true; }
	// 					return prev;
	// 				}, false);
	// 			});
	// 		}
	// 	});
	// 	return pubRenderLists;
	// }

	render() {
		return (
			<div className="layout-editor-component">
				<LayoutEditorInsert
					insertIndex={0}
					onInsert={this.handleInsert}
					// isPage={this.props.isPage}
				/>
				{this.state.layout.map((item, index)=> {
					const validType = ['pubs', 'text', 'html'].indexOf(item.type) > -1;
					// const editorTypeComponent = this.getComponentFromType(item, index);
					// if (!editorTypeComponent) { return null; }
					if (!validType) { return null; }
					return (
						<div>
							<div key={`block-${item.id}`} className="component-wrapper">
								{item.type === 'pubs' &&
									<LayoutEditorPubs
										key={`item-${item.id}`}
										onChange={this.handleChange}
										onRemove={this.handleRemove}
										layoutIndex={index}
										content={item.content}
										pubRenderList={this.state.pubRenderLists[index] || []}
										pubs={this.props.pubs}
										communityData={this.props.communityData}
									/>
								}
								{item.type === 'text' &&
									<LayoutEditorText
										key={`item-${item.id}`}
										onChange={this.handleChange}
										onRemove={this.handleRemove}
										layoutIndex={index}
										content={item.content}
									/>
								}
								{item.type === 'html' &&
									<LayoutEditorHtml
										key={`item-${item.id}`}
										onChange={this.handleChange}
										onRemove={this.handleRemove}
										layoutIndex={index}
										content={item.content}
									/>
								}
							</div>
							<LayoutEditorInsert
								key={`insert-${item.id}`}
								insertIndex={index + 1}
								onInsert={this.handleInsert}
								// isPage={this.props.isPage}
							/>
						</div>
					);
					// return [
					// 	<div key={`block-${item.id}`} className="component-wrapper">{editorTypeComponent}</div>,
					// 	<LayoutEditorInsert
					// 		key={`insert-${item.id}`}
					// 		insertIndex={index + 1}
					// 		onInsert={this.handleInsert}
					// 		isPage={this.props.isPage}
					// 	/>
					// ];
				})}
			</div>
		);
	}
}

// LayoutEditor.defaultProps = defaultProps;
LayoutEditor.propTypes = propTypes;
export default LayoutEditor;
