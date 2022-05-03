import React, { useRef, useCallback, useEffect } from 'react';
import { DOMSerializer, Node } from 'prosemirror-model';
import { editorSchema, getDocForHtmlString, isEmptyDocNode } from 'components/Editor';

import { MinimalEditor } from 'components';

type Props = {
	debug?: boolean;
	initialHtmlString: string;
	onChange: (htmlContents: string) => unknown;
	placeholder?: string;
};

const SimpleEditor = (props: Props) => {
	const { onChange, placeholder, initialHtmlString, debug } = props;
	const initialDoc = useRef<{ [key: string]: any }>();

	if (!initialDoc.current) {
		initialDoc.current = getDocForHtmlString(initialHtmlString, editorSchema).toJSON();
	}

	useEffect(() => {
		if (debug) {
			console.log('simpleEditor mount!');
		}
	}, []);

	const handleEdit = useCallback(
		(doc: Node) => {
			const { schema } = doc.type;
			if (isEmptyDocNode(doc)) {
				onChange('');
				return;
			}
			const serializer = DOMSerializer.fromSchema(schema);
			const domFragment = serializer.serializeFragment(doc.content);
			const wrapper = document.createElement('div');
			wrapper.appendChild(domFragment);
			onChange(wrapper.innerHTML);
		},
		[onChange],
	);

	return (
		<MinimalEditor
			onEdit={handleEdit}
			placeholder={placeholder}
			initialContent={initialDoc.current}
			useFormattingBar={true}
			isTranslucent={true}
			constrainHeight={true}
		/>
	);
};

export default SimpleEditor;
