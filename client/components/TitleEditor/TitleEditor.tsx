import classNames from 'classnames';
import React, { ClipboardEvent, useCallback, useEffect, useRef } from 'react';

require('./titleEditor.scss');

type Props = {
	isReadOnly?: boolean;
	initialValue?: string;
	onChange?: (value: string) => void;
	className?: string;
	placeholder?: string;
};

const SUPPORTED_DECORATIONS = new Set(['i', 'em', 'b', 'strong']);

function isChildOf(descendant: Node, ancestor: Node) {
	let node: Node | null = descendant;
	while (node !== null) {
		if (node === ancestor) return true;
		node = node.parentNode;
	}
	return false;
}

function stripAttrs(element: Element) {
	while (element.attributes.length > 0) {
		element.removeAttribute(element.attributes[0].name);
	}
}

function sanitizeElement(element: Element) {
	if (!SUPPORTED_DECORATIONS.has(element.tagName.toLowerCase())) {
		const parent = element.parentNode!;
		if (element.textContent !== null && element.textContent.length > 0) {
			const textNode = document.createTextNode(element.textContent ?? '');
			parent.replaceChild(textNode, element);
		} else {
			parent.removeChild(element);
		}
		return;
	}
	stripAttrs(element);
	if (element.nodeType === Node.ELEMENT_NODE) {
		for (let i = element.children.length - 1; i >= 0; i--) {
			sanitizeElement(element.children[i]);
		}
	} else if (element.nodeType === Node.TEXT_NODE) {
		element.textContent = element.textContent?.replace(/[\r\n]+/gm, '') ?? null;
	}
}

function sanitizeDocumentFragment(doc: DocumentFragment) {
	for (let i = doc.children.length - 1; i >= 0; i--) {
		sanitizeElement(doc.children[i]);
	}
}

function parseDom(html: string) {
	const template = document.createElement('template');
	template.innerHTML = html;
	return template;
}

const commonProps = {
	role: 'textbox',
	'aria-label': 'Edit Pub title',
	tabIndex: 0,
	contentEditable: true,
};

export default function TitleEditor(props: Props) {
	const { initialValue = '', onChange, isReadOnly = false, ...restProps } = props;
	const node = useRef<HTMLDivElement>(null);
	const init = useRef(false);
	const onPaste = useCallback(
		(event: ClipboardEvent) => {
			event.preventDefault();
			const editor = node.current;
			if (editor === null) return;
			const selection = getSelection();
			if (selection === null) return;
			const range = selection.getRangeAt(0);
			const html = event.clipboardData.getData('text/html');
			const dom = parseDom(html);
			sanitizeDocumentFragment(dom.content);
			let pasted = false;
			// execCommand is a deprecated API, but it's still found in most
			// browsers and is the easist way to support undo/redo without
			// implementing a fully-controlled editor
			if ('execCommand' in document) {
				pasted = document.execCommand('insertHTML', false, dom.innerHTML);
			}
			// execCommand is either unsupported or the 'insertHTML' command
			// failed, so we'll need to insert the sanitized content manually.
			// Undo won't work here, unfortunately.
			if (pasted === false) {
				const target = selection.focusNode;
				if (!target) return;
				if (!isChildOf(target, editor)) return;
				range.deleteContents();
				range.insertNode(dom.content);
				range.collapse(false);
			}
		},
		[node],
	);

	const onKeyDown = useCallback((event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
		} else if (event.key.toLowerCase() === 'u' && event.metaKey) {
			event.preventDefault();
		}
	}, []);

	// contenteditable inserts a <br> when it contains an element (e.g. <b>,
	// <em>, etc.) and its contents are cleared.
	const onInput = useCallback(() => {
		if (node.current?.textContent === '') {
			node.current.innerHTML = '';
		}
		onChange?.(node.current?.innerHTML ?? '');
	}, [node, onChange]);

	useEffect(() => {
		if (init.current) return;
		if (node.current) {
			node.current.innerHTML = initialValue;
			init.current = true;
			onChange?.(initialValue);
		}
	}, [initialValue, onChange]);

	const sharedProps = {
		...commonProps,
		...restProps,
		className: classNames('title-editor-component', restProps.className),
		'data-placeholder': restProps.placeholder,
	};

	if (typeof window === 'undefined' || isReadOnly) {
		return <div {...sharedProps} dangerouslySetInnerHTML={{ __html: initialValue }} />;
	}

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			{...sharedProps}
			ref={node}
			onKeyDown={onKeyDown}
			onPaste={onPaste}
			onInput={onInput}
		/>
	);
}
