import React from 'react';

import { MinimalEditor } from 'components';
import { DocJson } from 'types';

require('./reviewEditor.scss');

type Props = {
	setReviewDoc: any;
	setIsLoading: any;
};

const ReviewEditor = (props: Props) => {
	const { setReviewDoc, setIsLoading } = props;

	const updatingReviewDoc = (doc: DocJson) => {
		setIsLoading(true);
		setReviewDoc(doc);
		setTimeout(() => {
			setIsLoading(false);
		}, 300);
	};
	return (
		<div className="review-editor">
			<div className="review-editor-component">
				<MinimalEditor
					getButtons={(buttons) => buttons.reviewButtonSet}
					onEdit={(doc) => updatingReviewDoc(doc.toJSON() as DocJson)}
					debounceEditsMs={300}
					useFormattingBar
					focusOnLoad={true}
				/>
			</div>
		</div>
	);
};

export default ReviewEditor;
