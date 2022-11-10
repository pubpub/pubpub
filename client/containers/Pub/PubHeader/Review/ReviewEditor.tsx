import React, { useCallback } from 'react';

import { MinimalEditor } from 'components';
import { DocJson } from 'types';

type Props = {
	setReviewDoc: (doc: DocJson) => void;
	reviewDoc: DocJson;
};

const ReviewEditor = React.forwardRef((props: Props, ref: any) => {
	const { setReviewDoc, reviewDoc } = props;

	const handleEdit = useCallback((doc) => setReviewDoc(doc.toJSON() as DocJson), []);

	return (
		<div className="review-editor-component" ref={ref}>
			<MinimalEditor
				getButtons={(buttons) => buttons.reviewButtonSet}
				onEdit={handleEdit}
				useFormattingBar
				focusOnLoad={true}
				initialContent={reviewDoc}
				placeholder="Compose your review here..."
			/>
		</div>
	);
});

export default ReviewEditor;
