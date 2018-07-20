import app from '../server';
import { WorkerTask } from '../models';

app.get('/api/workerTasks', (req, res)=> {
	return WorkerTask.findOne({
		where: {
			id: req.query.workerTaskId,
		}
	})
	.then((workerTaskData)=> {
		return res.status(201).json(workerTaskData);
	})
	.catch((err)=> {
		console.error('Error getting WorkerTask', err);
		return res.status(500).json(err);
	});
});
