import React from 'react';

import { MinimalEditor } from 'components';
import { DocJson } from 'types';
import { useLocalStorage } from 'client/utils/useLocalStorage';
import { getEmptyDoc } from 'client/components/Editor';

require('./reviewEditor.scss');

type Props = {
	setReviewDoc: any;
	communityData: any;
	pubData: any;
};

const ReviewEditor = (props: Props) => {
	const {
		setReviewDoc,
		communityData,
		pubData: { id },
	} = props;

	const { value: review, setValue: setReview } = useLocalStorage<DocJson>({
		initial: () => getEmptyDoc(),
		communityId: communityData.id,
		featureName: 'new-review-editor',
		path: [`pub-${id}`],
		debounce: 100,
	});

	const updatingReviewDoc = (doc: DocJson) => {
		setReview(doc);
		setReviewDoc(review);
	};

	return (
		<div className="review-editor">
			<div className="review-editor-component">
				<MinimalEditor
					getButtons={(buttons) => buttons.reviewButtonSet}
					onEdit={(doc) => updatingReviewDoc(doc.toJSON() as DocJson)}
					useFormattingBar
					focusOnLoad={true}
					initialContent={review}
				/>
			</div>
		</div>
	);
};

export default ReviewEditor;
