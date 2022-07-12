import React from 'react';

import { MinimalEditor } from 'components';

require('./reviewEditor.scss');

const ReviewEditor = () => {
	const sharedProps = {
		customNodes: { doc: { content: 'paragraph' } },
		constrainHeight: true,
		noMinHeight: true,
	};

	return (
		<div className="review-editor">
			<MinimalEditor
				{...sharedProps}
				getButtons={(buttons) => buttons.minimalButtonSet}
				onEdit={() => {
					console.log('it has been done');
				}}
				debounceEditsMs={300}
				useFormattingBar
				focusOnLoad={true}
				constrainHeight={true}
			/>
		</div>
	);
};

export default ReviewEditor;
