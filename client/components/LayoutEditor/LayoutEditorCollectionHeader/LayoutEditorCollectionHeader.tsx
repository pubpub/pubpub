import React, { useCallback } from 'react';
import { Button } from '@blueprintjs/core';

import { InputField, Popover } from 'components';
import { LayoutCollectionHeader } from 'components/Layout';
import { Collection } from 'types';
import { LayoutBlockCollectionHeader } from 'utils/layout/types';
import Metadata from './getMetaDataChecklist';
import PreviewElements from './PreviewElements';

type Content = LayoutBlockCollectionHeader['content'];

type Props = {
	onChange: (index: number, content: Partial<Content>) => any;
	layoutIndex: number;
	block: LayoutBlockCollectionHeader;
	collection: Collection;
};

const LayoutEditorCollectionHeader = (props: Props) => {
	const { onChange: fullOnChange, layoutIndex, block, collection } = props;

	const onChange = useCallback((update: Partial<Content>) => fullOnChange(layoutIndex, update), [
		fullOnChange,
		layoutIndex,
	]);

	const renderPreviewElements = () => {
		return (
			<Popover
				aria-label="Choose preview elements"
				content={
					<PreviewElements
						content={block.content}
						collection={collection}
						onChange={onChange}
					/>
				}
			>
				<Button outlined icon="settings" rightIcon="caret-down">
					Header fields
				</Button>
			</Popover>
		);
	};

	const renderMetadataElements = () => {
		return (
			<Popover
				aria-label="Choose preview elements"
				content={
					<Metadata content={block.content} collection={collection} onChange={onChange} />
				}
			>
				<Button outlined icon="settings" rightIcon="caret-down">
					Metadata fields
				</Button>
			</Popover>
		);
	};

	const renderElements = () => {
		return (
			<InputField label="Preview Elements">
				<div className="controls-row">
					{renderPreviewElements()}
					{renderMetadataElements()}
				</div>
			</InputField>
		);
	};

	return (
		<div className="layout-editor-collection-header-component">
			<div className="block-header">{renderElements()}</div>
			<LayoutCollectionHeader collection={collection} content={block.content} />
		</div>
	);
};
export default LayoutEditorCollectionHeader;
