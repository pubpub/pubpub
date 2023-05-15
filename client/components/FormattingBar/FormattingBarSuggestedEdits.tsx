import React, { useEffect, useRef } from 'react';
import { Button } from 'reakit';

import { EditorChangeObject } from 'components/Editor';
import { useRefMap } from 'client/utils/useRefMap';
import { usePageContext } from 'utils/hooks';
import { Icon } from 'components';

// import { getButtonPopoverComponent } from './utils';
import { FormattingBarButtonData, ControlsConfiguration } from './types';
// import { usePendingAttrs } from './hooks/usePendingAttrs';
// import FormattingBarButton from './FormattingBarButton';
import { ButtonState, useControlsState } from './hooks/useControlsState';

type Props = {
	editorChangeObject: EditorChangeObject;
	buttons: FormattingBarButtonData[][];
	controlsConfiguration?: Partial<ControlsConfiguration>;
};

const getInnerStyle = (accentColor, isOpen, isDetached) => {
	if (isOpen && isDetached) {
		return {
			background: accentColor,
		};
	}
	return {};
};

const FormattingBarSuggestedEdits = (props: Props) => {
	const { editorChangeObject, buttons, controlsConfiguration } = props;
	console.log(editorChangeObject, buttons, controlsConfiguration);
	const buttonElementRefs = useRefMap();
	const wrapperRef = useRef<null | HTMLDivElement>(null);
	// const toolbar = useToolbarState({ loop: true });
	// const pendingAttrs = usePendingAttrs(editorChangeObject);

	const { communityData } = usePageContext();

	const {
		openedButton,
		// setOpenedButton,
		// selectedNodeId,
		buttonStates,
		// resolvedControlsConfiguration,
	} = useControlsState({
		buttons,
		editorChangeObject,
		controlsConfiguration: {
			kind: 'anchored',
			container: wrapperRef.current!,
			isAbsolutelyPositioned: false,
			isFullScreenWidth: false,
			...controlsConfiguration,
		},
	});

	useEffect(() => {
		if (openedButton) {
			const ref = buttonElementRefs.getRef(openedButton.key);
			if (ref && ref.current && typeof ref.current.scrollIntoView === 'function') {
				const buttonElement = ref.current;
				const paddingPx = 5;
				buttonElement.parentNode.scrollLeft = buttonElement.offsetLeft - paddingPx;
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [openedButton]);

	const renderButtonState = (buttonState: ButtonState) => {
		const { button, isOpen, isActive, isDisabled, isDetached, onClick } = buttonState;
		// const PopoverComponent = getButtonPopoverComponent(button, isDisabled);

		return (
			// <ToolbarItem
			// 	{...toolbar}
			// 	outerRef={}
			// 	as={button.component || FormattingBarButton}
			// 	key={button.key}
			// 	label={button.label}
			// 	formattingItem={button}
			// 	disabled={isDisabled}
			// 	isActive={isActive}
			// 	isIndicated={isIndicated && !isOpen}
			// 	isOpen={isOpen}
			// 	isDetached={isDetached}
			// 	popoverContent={PopoverComponent && <PopoverComponent />}
			// 	accentColor={communityData.accentColorDark}
			// 	onClick={onClick}
			// />
			<Button
				ref={buttonElementRefs.getRef(button.key)}
				role="button"
				disabled={isDisabled}
				focusable
				title={button.title}
				aria-label={button.label}
				aria-pressed={isActive}
				style={getInnerStyle(communityData.accentColorDark, isOpen, isDetached)}
				onClick={onClick}
			>
				<Icon icon={button.icon} iconSize={16} />
				{button.label}
			</Button>
		);
	};

	const renderButtonGroup = (states: ButtonState[], index: number) => {
		return (
			<React.Fragment key={index}>
				{index > 0 && <div className="separator" />}
				{states.map(renderButtonState)}
			</React.Fragment>
		);
	};
	const renderControls = () => {
		return <>{buttonStates.map(renderButtonGroup)}</>;
	};
	return renderControls();
};

export default FormattingBarSuggestedEdits;
