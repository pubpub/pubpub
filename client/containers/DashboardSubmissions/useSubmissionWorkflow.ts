import { SubmissionWorkflow } from 'types';
import { getEmptyDoc } from 'client/components/Editor';
import { usePersistableState } from 'client/utils/usePersistableState';
import { isValidEmail } from 'utils/email';

import {
	RecordValidator,
	isValidDocJson,
	isAlwaysValid,
	isValidBannerContent,
	validate,
} from './validators';

type EditableSubmissionWorkflow = Omit<SubmissionWorkflow, 'id' | 'createdAt' | 'updatedAt'>;

const validator: RecordValidator<EditableSubmissionWorkflow> = {
	instructionsText: isValidDocJson,
	emailText: isValidDocJson,
	targetEmailAddress: isValidEmail,
	enabled: isAlwaysValid,
	bannerContent: isValidBannerContent,
};

const createEmptyWorkflow = (): EditableSubmissionWorkflow => {
	return {
		instructionsText: getEmptyDoc(),
		emailText: getEmptyDoc(),
		targetEmailAddress: '',
		enabled: true,
		bannerContent: {
			title: '',
			body: getEmptyDoc(),
		},
	};
};

const stubPersist = () => new Promise<void>((resolve) => setTimeout(resolve, 500));

export const useSubmissionWorkflow = (initialWorkflow: null | EditableSubmissionWorkflow) => {
	const { state: workflow, update: updateWorkflow } = usePersistableState(
		() => initialWorkflow || createEmptyWorkflow(),
		stubPersist,
	);
	const { isValid, fields: fieldValidStates } = validate(workflow, validator);

	return { workflow, updateWorkflow, isValid, fieldValidStates };
};
