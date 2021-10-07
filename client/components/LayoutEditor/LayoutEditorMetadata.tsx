import React, { useCallback } from 'react';
import { Button } from '@blueprintjs/core';

import { GridWrapper, Popover } from 'components';
import { LayoutBlockMetadata } from 'utils/layout';
import { Collection } from 'types';
import Metadata from './getMetaDataChecklist';

type Content = LayoutBlockMetadata['content'];

type Props = {
	onChange: (index: number, content: Partial<Content>) => unknown;
	content: Content;
	layoutIndex: number;
	collection: Collection;
};

const LayoutEditorMetadata = (props: Props) => {
	const { onChange: fullOnChange, content, layoutIndex, collection } = props;

	const onChange = useCallback((update: Partial<Content>) => fullOnChange(layoutIndex, update), [
		fullOnChange,
		layoutIndex,
	]);

	const renderPreviewElements = () => {
		return (
			<Popover
				aria-label="Choose preview elements"
				content={
					<Metadata
						content={content}
						collection={collection}
						onChangeContent={onChange}
					/>
				}
			>
				<Button outlined icon="settings" rightIcon="caret-down">
					Metadata fields
				</Button>
			</Popover>
		);
	};

	return (
		<div className="layout-editor-pages-component">
			<div className="block-header rows">
				<div className="controls-row">{renderPreviewElements()}</div>
			</div>
			<GridWrapper>collectionMetadata</GridWrapper>
		</div>
	);
};
export default LayoutEditorMetadata;
