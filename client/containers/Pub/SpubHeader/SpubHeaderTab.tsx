import React, { useRef, useState, useEffect } from 'react';

import { useViewport } from 'client/utils/useViewport';

require('./spubHeaderTab.scss');

type Props = {
	children?: React.ReactNode;
	expandToFold: boolean;
};

const SpubHeaderTabWrapper = (props: Props) => {
	const elementRef = useRef<HTMLDivElement>(null);
	const [minHeight, setMinHeight] = useState(0);
	const { viewportHeight } = useViewport();
	useEffect(() => {
		if (elementRef.current) {
			setMinHeight(
				(viewportHeight || 0) -
					elementRef.current.getBoundingClientRect().top -
					window.scrollY,
			);
		}
	}, [viewportHeight]);
	return (
		<div
			style={{ ...(props.expandToFold && { minHeight }) }}
			className="spub-header-tab-component"
			ref={elementRef}
		>
			{props.children}
		</div>
	);
};

export default SpubHeaderTabWrapper;
