import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ControlGroup, InputGroup } from '@blueprintjs/core';

import { MenuButton, MenuItem } from 'components/Menu';

require('./inlineLabelEditor.scss');

const propTypes = {
	customLabel: PropTypes.string.isRequired,
	defaultLabel: PropTypes.func.isRequired,
	onUpdateCustomLabel: PropTypes.func.isRequired,
	citationInlineStyle: PropTypes.string.isRequired,
};

const InlineLabelEditor = (props) => {
	const { customLabel, defaultLabel, onUpdateCustomLabel, citationInlineStyle } = props;
	const [usingCustomLabel, setUsingCustomLabel] = useState(!!customLabel);
	const citationInlineStyleStrings = {
		count: 'Pub default: [count]',
		authorYear: 'Pub default: (Author, Year)',
		author: 'Pub default: (Author)',
		label: 'Pub default: (Label)',
	};
	const citationInlineStyleString = citationInlineStyleStrings[citationInlineStyle];
	const buttonLabel = usingCustomLabel ? 'Custom' : citationInlineStyleString;

	const handleSelectDefault = () => {
		setUsingCustomLabel(false);
		onUpdateCustomLabel('');
	};

	const handleSelectCustom = () => setUsingCustomLabel(true);

	return (
		<ControlGroup className="inline-label-editor-component">
			<MenuButton
				aria-label="Choose an inline label type"
				buttonProps={{
					minimal: true,
					rightIcon: 'chevron-down',
					className: 'label-type-menu',
				}}
				buttonContent={buttonLabel}
			>
				<MenuItem text={citationInlineStyleString} onClick={handleSelectDefault} />
				<MenuItem text="Custom" onClick={handleSelectCustom} />
			</MenuButton>
			<InputGroup
				disabled={!usingCustomLabel}
				value={usingCustomLabel ? customLabel : defaultLabel}
				onChange={(evt) => onUpdateCustomLabel(evt.target.value)}
			/>
		</ControlGroup>
	);
};

InlineLabelEditor.propTypes = propTypes;
export default InlineLabelEditor;
