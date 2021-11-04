import { getEmptyDoc } from 'client/components/Editor';
import { usePersistableState } from 'client/utils/usePersistableState';
import { SubmissionWorkflow } from 'types';

type EditableSubmissionWorkflow = Omit<SubmissionWorkflow, 'id' | 'createdAt' | 'updatedAt'>;

const createEmptyWorkflow = (): EditableSubmissionWorkflow => {
	return {
		instructionsText: getEmptyDoc(),
		afterSubmittedText: getEmptyDoc(),
		emailText: getEmptyDoc(),
		targetEmailAddress: null,
		enabled: true,
	};
};

const stubPersist = () => new Promise<void>((resolve) => setTimeout(resolve, 500));

export const useSubmissionWorkflow = (initialWorkflow: null | EditableSubmissionWorkflow) => {
	const { state: workflow, update: updateWorkflow } = usePersistableState(
		() => initialWorkflow || createEmptyWorkflow(),
		stubPersist,
	);

	return { workflow, updateWorkflow };
};
