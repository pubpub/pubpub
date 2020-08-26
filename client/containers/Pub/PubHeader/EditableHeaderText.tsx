import React, { useState, useEffect } from 'react';
import { EditableText } from '@blueprintjs/core';

type OwnProps = {
	canEdit: boolean;
	className?: string;
	placeholder: string;
	tagName?: string;
	text?: string;
	updateText: (...args: any[]) => any;
	maxLength: number;
};

const defaultProps = {
	className: '',
	tagName: 'h1',
	text: null,
	maxLength: Infinity,
};

type Props = OwnProps & typeof defaultProps;

const EditableHeaderText = (props: Props) => {
	const { canEdit, className, placeholder, tagName, text, updateText, maxLength } = props;
	const [hasMounted, setHasMounted] = useState(false);
	const [intermediateValue, setIntermediateValue] = useState(text);
	const useEditableTitle = hasMounted && canEdit;

	useEffect(() => setHasMounted(true), []);
	useEffect(() => setIntermediateValue(text), [text]);

	return React.createElement(
		tagName,
		{ className: className },
		useEditableTitle ? (
			<>
				<EditableText
					placeholder={placeholder}
					// @ts-expect-error ts-migrate(2349) FIXME: Type 'never' has no call signatures.
					onConfirm={(newText) => updateText(newText.replace(/\n/g, ''))}
					// @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type '(prevStat... Remove this comment to see the full error message
					onChange={setIntermediateValue}
					value={intermediateValue}
					multiline={true}
					confirmOnEnterKey={true}
					maxLength={maxLength}
				/>
				<LengthIndicator maxLength={maxLength} length={(intermediateValue || '').length} />
			</>
		) : (
			<span className="text-wrapper">{text}</span>
		),
	);
};
EditableHeaderText.defaultProps = defaultProps;
export default EditableHeaderText;
