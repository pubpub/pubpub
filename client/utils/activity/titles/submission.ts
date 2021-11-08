import { SubmissionActivityItem } from 'types';
import { pubUrl } from 'utils/canonicalUrls';

import { TitleRenderer } from '../types';
import { getPubFromContext } from './util';

export const submissionTitle: TitleRenderer<SubmissionActivityItem> = (
	item: SubmissionActivityItem,
	context,
) => {
	const pubFromContext = getPubFromContext(item.pubId, context);
	const href = pubFromContext ? pubUrl(null, pubFromContext) : null;
	return { title: 'a Submission', href };
};
