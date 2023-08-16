import app from 'server/server';

import { validate } from 'utils/api';
import { z } from 'zod';
import { getWorkerTask } from './queries';

app.get(
	'/api/workerTasks',
	validate({
		description:
			'Get the status of a worker task. This is used to poll for the status of a worker task, such as an import or export.',
		query: {
			workerTaskId: z.string().uuid(),
		},
		statusCodes: {
			201: z.object({
				id: z.string().uuid(),
				isProcessing: z.boolean().nullable(),
				error: z.any().nullable(),
				output: z.any().nullable(),
			}),
			404: z.object({
				error: z.literal('WorkerTask not found'),
			}),
		},
	}),
	(req, res) => {
		return getWorkerTask(req.query as { workerTaskId: string })
			.then((workerTaskData) => {
				if (workerTaskData === null) {
					return res.status(404).json({ error: 'WorkerTask not found' });
				}
				return res.status(201).json(workerTaskData);
			})
			.catch((err) => {
				console.error('Error getting WorkerTask', err);
				return res.status(500).json(err);
			});
	},
);
