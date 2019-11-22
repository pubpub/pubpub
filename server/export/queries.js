import { WorkerTask, Export } from '../models';
import { addWorkerTask } from '../utils';

export const startExportTask = async ({ pubId, branchId, format, historyKey }) => {
	const taskData = {
		pubId: pubId,
		branchId: branchId,
		format: format,
		historyKey: historyKey,
	};

	const task = await WorkerTask.create({
		isProcessing: true,
		type: 'export',
		input: taskData,
	});

	await addWorkerTask(
		JSON.stringify({
			id: task.id,
			type: task.type,
			input: taskData,
		}),
	);

	return Export.create({ ...taskData, workerTaskId: task.id });
};
