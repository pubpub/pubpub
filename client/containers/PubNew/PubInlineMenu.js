import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import Icon from 'components/Icon/Icon';

require('./pubInlineMenu.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	collabData: PropTypes.object.isRequired,
	onNewHighlightDiscussion: PropTypes.func,
	openLinkMenu: PropTypes.func,
};

const defaultProps = {
	openLinkMenu: () => {},
	onNewHighlightDiscussion: () => {},
};

const PubInlineMenu = (props) => {
	const selection = props.collabData.editorChangeObject.selection || {};
	const selectionBoundingBox = props.collabData.editorChangeObject.selectionBoundingBox || {};

	if (
		!props.collabData.editorChangeObject.selection ||
		selection.empty ||
		props.collabData.editorChangeObject.selectedNode
	) {
		return null;
	}

	const menuStyle = {
		position: 'absolute',
		top: selectionBoundingBox.top - 50 + window.scrollY,
		left: selectionBoundingBox.left,
	};
	const menuItems = props.collabData.editorChangeObject.menuItems;
	const menuItemsObject = menuItems.reduce((prev, curr) => {
		return { ...prev, [curr.title]: curr };
	}, {});
	const formattingItems = [
		{ key: 'header1', icon: <Icon icon="header-one" /> },
		{ key: 'header2', icon: <Icon icon="header-two" /> },
		{ key: 'strong', icon: <Icon icon="bold" /> },
		{ key: 'em', icon: <Icon icon="italic" /> },
		{ key: 'link', icon: <Icon icon="link" /> },
	];
	const isReadOnly = props.pubData.isStaticDoc || !props.pubData.isEditor;

	// TODO: Make discussions disable-able
	// if (isReadOnly && !props.pubData.publicDiscussions) {
	// 	return null;
	// }
	return (
		<div className="pub-inline-menu-component bp3-elevation-2" style={menuStyle}>
			{!isReadOnly &&
				formattingItems.map((item) => {
					if (!menuItemsObject[item.key]) {
						return null;
					}
					const onClickAction =
						item.key === 'link'
							? () => {
									menuItemsObject[item.key].run();
									props.openLinkMenu();
							  }
							: menuItemsObject[item.key].run;
					return (
						<Button
							key={item.key}
							className="bp3-minimal"
							icon={item.icon}
							active={menuItemsObject[item.key].isActive}
							onClick={onClickAction}
							onMouseDown={(evt) => {
								evt.preventDefault();
							}}
						/>
					);
				})}
			<Button
				className="bp3-minimal"
				icon={<Icon icon="chat" />}
				onClick={() => {
					props.onNewHighlightDiscussion({
						from: props.collabData.editorChangeObject.selection.from,
						to: props.collabData.editorChangeObject.selection.to,
						version: props.pubData.activeVersion.id,
						// section: props.sectionId,
						exact: props.collabData.editorChangeObject.selectedText.exact,
						prefix: props.collabData.editorChangeObject.selectedText.prefix,
						suffix: props.collabData.editorChangeObject.selectedText.suffix,
					});
				}}
			/>
		</div>
	);
};

PubInlineMenu.propTypes = propTypes;
PubInlineMenu.defaultProps = defaultProps;
export default PubInlineMenu;
