import app from '../server';
import { getOrStartExportTask } from './queries';

app.post('/api/export', (req, res) => {
	return getOrStartExportTask(req.body)
		.then((result) => {
			return res.status(200).json(result);
		})
		.catch((err) => {
			console.error('Error in postExport: ', err);
			return res.status(500).json(err.message);
		});
});
