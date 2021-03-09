import React, { useCallback, useMemo } from 'react';
import { Button } from '@blueprintjs/core';

import { InputField, Popover, OrderPicker } from 'components';
import LayoutPagesCollections, {
	Content,
	BlockItem,
	PageOrCollection,
} from 'components/Layout/LayoutPagesCollections';
import { splitArrayOn } from 'utils/arrays';

type Props = {
	onChange: (index: number, block: Content) => any;
	content: Content;
	layoutIndex: number;
	pages: PageOrCollection[];
	collections: PageOrCollection[];
};

type OrderableItem = BlockItem & {
	title: string;
};

const getOrderableItem = (item: PageOrCollection, type: OrderableItem['type']): OrderableItem => {
	return {
		type,
		id: item.id,
		title: item.title,
	};
};

const getBlockItem = (item: OrderableItem): BlockItem => {
	return {
		type: item.type,
		id: item.id,
	};
};

const getAllItems = (
	collections: PageOrCollection[],
	pages: PageOrCollection[],
): OrderableItem[] => {
	return [
		...collections.map((collection) => getOrderableItem(collection, 'collection')),
		...pages.map((page) => getOrderableItem(page, 'page')),
	].sort((a, b) => (a.title > b.title ? 1 : -1));
};

const LayoutEditorPages = (props: Props) => {
	const { layoutIndex, onChange, content, collections, pages } = props;

	const allItems = useMemo(() => getAllItems(collections, pages), [collections, pages]);
	const [availableItems, selectedItems] = useMemo(
		() =>
			splitArrayOn(allItems, (item) =>
				content.items.some((contentItem) => contentItem.id === item.id),
			),
		[content.items, allItems],
	);

	const setTitle = useCallback(
		(title: string) =>
			onChange(layoutIndex, {
				...content,
				title,
			}),
		[onChange, layoutIndex, content],
	);

	const setSelectedItems = useCallback(
		(items: OrderableItem[]) =>
			onChange(layoutIndex, {
				...content,
				items: items.map(getBlockItem),
			}),
		[onChange, layoutIndex, content],
	);

	return (
		<div className="layout-editor-pages-component">
			<div className="block-header">
				<InputField
					label="Title"
					value={content.title}
					onChange={(evt) => setTitle(evt.target.value)}
				/>
				<InputField label="Collections & Pages">
					<Popover
						aria-label="Choose pinned Pubs for this block"
						className="order-picker-popover"
						placement="bottom-end"
						content={
							<OrderPicker
								availableItems={availableItems}
								selectedItems={selectedItems}
								onSelectedItems={setSelectedItems}
								renderItem={(item) => item.title}
							/>
						}
					>
						<Button rightIcon="caret-down">
							Choose Items
							{selectedItems.length ? ` (${selectedItems.length})` : ''}
						</Button>
					</Popover>
					{/* <Popover
						content={
							<OrderPicker
								selectedItems={selectedItems}
								allItems={allItems}
								onChange={setSelectedItems}
								uniqueId={String(layoutIndex)}
								selectedTitle="Displayed items"
								availableTitle="Available items"
							/>
						}
						interactionKind={PopoverInteractionKind.CLICK}
						position={Position.BOTTOM_RIGHT}
						usePortal={false}
						minimal={true}
						popoverClassName="order-picker-popover"
					>
						<Button rightIcon="caret-down">Choose items</Button>
					</Popover> */}
				</InputField>
			</div>
			<LayoutPagesCollections content={content} pages={pages} collections={collections} />
		</div>
	);
};
export default LayoutEditorPages;
