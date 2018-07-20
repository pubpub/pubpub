import app from '../server';
import { WorkerTask } from '../models';
import { addWorkerTask } from '../utilities';

app.post('/api/export', (req, res)=> {
	return WorkerTask.create({
		isProcessing: true,
		type: 'export',
	})
	.then((workerTaskData)=> {
		const sendMessage = addWorkerTask(JSON.stringify({
			id: workerTaskData.id,
			type: workerTaskData.type,
			pubId: req.body.pubId,
			versionId: req.body.versionId,
			content: req.body.content,
			format: req.body.format,
		}));
		return Promise.all([workerTaskData, sendMessage]);
	})
	.then(([workerTaskData])=> {
		return res.status(201).json(workerTaskData.id);
	})
	.catch((err)=> {
		console.error('Error Adding Message', err);
		return res.status(500).json(err);
	});
});
