import React, { Component } from 'react';
import { Button } from '@blueprintjs/core';
import stickybits from 'stickybits';

import { generateHash } from 'utils/hashes';
import { getPubsByBlockIndex } from 'utils/layout';

import { validBlockTypes } from 'utils/layout';

import LayoutEditorInsert from './LayoutEditorInsert';
import LayoutEditorPubs from './LayoutEditorPubs';
import LayoutEditorPagesCollections from './LayoutEditorPagesCollections';
import LayoutEditorText from './LayoutEditorText';
import LayoutEditorHtml from './LayoutEditorHtml';
import LayoutEditorBanner from './LayoutEditorBanner';

require('./layoutEditor.scss');

type Props = {
	onChange: (...args: any[]) => any;
	initialLayout: any[];
	pubs: any[];
	communityData: any;
};

type State = any;

const getTitleKindForBlock = (blockType: string) => {
	if (blockType === 'collections-pages') {
		return 'Collections & Pages';
	}
	if (blockType === 'html') {
		return 'HTML';
	}
	return blockType;
};

class LayoutEditor extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			layout: props.initialLayout,
			pubRenderLists: getPubsByBlockIndex(props.initialLayout, props.pubs),
		};
		this.handleInsert = this.handleInsert.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.handleMoveUp = this.handleMoveUp.bind(this);
		this.handleMoveDown = this.handleMoveDown.bind(this);
		// @ts-expect-error ts-migrate(2339) FIXME: Property 'stickyInstance' does not exist on type '... Remove this comment to see the full error message
		this.stickyInstance = undefined;
	}

	componentDidMount() {
		// @ts-expect-error ts-migrate(2339) FIXME: Property 'stickyInstance' does not exist on type '... Remove this comment to see the full error message
		this.stickyInstance = stickybits('.block-header', {
			// TODO(ian): this is a magic number to make this work "for now" --
			// it's the combined height of the global header and dashboard breadcrumbs
			stickyBitStickyOffset: 73 + 56,
		});
	}

	componentWillUnmount() {
		// @ts-expect-error ts-migrate(2339) FIXME: Property 'stickyInstance' does not exist on type '... Remove this comment to see the full error message
		if (this.stickyInstance && this.stickyInstance.cleanUp) {
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'stickyInstance' does not exist on type '... Remove this comment to see the full error message
			this.stickyInstance.cleanUp();
		}
	}

	handleInsert(index, type, newContent) {
		this.setState((prevState) => {
			const newLayout = prevState.layout;
			newLayout.splice(index, 0, {
				id: generateHash(8),
				type: type,
				content: newContent,
			});
			const newPubRenderList = getPubsByBlockIndex(newLayout, this.props.pubs);
			this.props.onChange(newLayout);
			return {
				layout: newLayout,
				pubRenderLists: newPubRenderList,
			};
		});
	}

	handleChange(index, newContent) {
		this.setState((prevState) => {
			const newLayout = prevState.layout;
			newLayout[index].content = newContent;
			const newPubRenderList = getPubsByBlockIndex(newLayout, this.props.pubs);
			this.props.onChange(newLayout);
			return {
				layout: newLayout,
				pubRenderLists: newPubRenderList,
			};
		});
	}

	handleRemove(index) {
		this.setState((prevState) => {
			const newLayout = prevState.layout;
			newLayout.splice(index, 1);
			this.props.onChange(newLayout);
			return { layout: newLayout };
		});
	}

	handleMoveUp(index) {
		this.setState((prevState) => {
			const newLayout = [...prevState.layout];
			newLayout[index - 1] = newLayout[index];
			newLayout[index] = prevState.layout[index - 1];

			const newPubRenderList = getPubsByBlockIndex(newLayout, this.props.pubs);
			this.props.onChange(newLayout);
			return {
				layout: newLayout,
				pubRenderLists: newPubRenderList,
			};
		});
	}

	handleMoveDown(index) {
		this.setState((prevState) => {
			const newLayout = [...prevState.layout];
			newLayout[index + 1] = newLayout[index];
			newLayout[index] = prevState.layout[index + 1];

			const newPubRenderList = getPubsByBlockIndex(newLayout, this.props.pubs);
			this.props.onChange(newLayout);
			return {
				layout: newLayout,
				pubRenderLists: newPubRenderList,
			};
		});
	}

	render() {
		return (
			<div className="layout-editor-component">
				<LayoutEditorInsert
					insertIndex={0}
					onInsert={this.handleInsert}
					communityData={this.props.communityData}
				/>
				{this.state.layout.map((item, index) => {
					const validType = validBlockTypes.indexOf(item.type) > -1;
					if (!validType) {
						return null;
					}
					return (
						<div key={item.id}>
							<div className="block-title">
								<div className="text">{getTitleKindForBlock(item.type)} Block</div>

								<div className="bp3-button-group bp3-minimal bp3-small">
									<Button
										text="Move Up"
										icon="caret-up"
										disabled={index === 0}
										onClick={() => {
											this.handleMoveUp(index);
										}}
									/>
									<Button
										text="Move Down"
										icon="caret-down"
										disabled={index === this.state.layout.length - 1}
										onClick={() => {
											this.handleMoveDown(index);
										}}
									/>
									<Button
										text="Remove"
										onClick={() => {
											this.handleRemove(index);
										}}
									/>
								</div>
							</div>
							<div key={`block-${item.id}`} className="component-wrapper">
								{item.type === 'pubs' && (
									<LayoutEditorPubs
										key={`item-${item.id}`}
										onChange={this.handleChange}
										layoutIndex={index}
										content={item.content}
										pubRenderList={this.state.pubRenderLists[index] || []}
										pubs={this.props.pubs}
										communityData={this.props.communityData}
									/>
								)}
								{item.type === 'text' && (
									<LayoutEditorText
										key={`item-${item.id}`}
										onChange={this.handleChange}
										layoutIndex={index}
										content={item.content}
									/>
								)}
								{item.type === 'html' && (
									<LayoutEditorHtml
										key={`item-${item.id}`}
										onChange={this.handleChange}
										layoutIndex={index}
										content={item.content}
									/>
								)}
								{item.type === 'banner' && (
									<LayoutEditorBanner
										key={`item-${item.id}`}
										onChange={this.handleChange}
										layoutIndex={index}
										content={item.content}
										communityData={this.props.communityData}
									/>
								)}
								{(item.type === 'pages' || item.type === 'collections-pages') && (
									<LayoutEditorPagesCollections
										key={`item-${item.id}`}
										onChange={this.handleChange}
										layoutIndex={index}
										content={item.content}
										pages={this.props.communityData.pages}
										collections={this.props.communityData.collections}
									/>
								)}
							</div>
							<LayoutEditorInsert
								key={`insert-${item.id}`}
								insertIndex={index + 1}
								onInsert={this.handleInsert}
								communityData={this.props.communityData}
							/>
						</div>
					);
				})}
			</div>
		);
	}
}
export default LayoutEditor;
