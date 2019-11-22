import app from '../server';
import { startExportTask } from './queries';

app.post('/api/export', (req, res) => {
	return startExportTask(req.body)
		.then((exportData) => {
			return res.status(200).json(exportData.workerTaskId);
		})
		.catch((err) => {
			console.error('Error in postExport: ', err);
			return res.status(500).json(err.message);
		});
});
