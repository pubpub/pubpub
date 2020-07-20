import amqplib from 'amqplib';

import { TaskPriority, taskQueueName } from 'utils/workers';
import { createWorkerTask } from 'server/workerTask/queries';

let openChannel;

const setOpenChannel = () => {
	amqplib.connect(process.env.CLOUDAMQP_URL).then((conn) => {
		return conn.createConfirmChannel().then((channel) => {
			return channel
				.assertQueue(taskQueueName, { durable: true, maxPriority: TaskPriority.Highest })
				.then(() => {
					openChannel = channel;
				});
		});
	});
};

if (process.env.NODE_ENV !== 'test') {
	setOpenChannel();
}

const ensureOpenChannel = () => {
	if (!openChannel) {
		setOpenChannel();
	}
};

const getDefaultTaskPriority = () => {
	const processPriorty = process.env.DEFAULT_QUEUE_TASK_PRIORITY;
	if (processPriorty) {
		return parseInt(processPriorty, 10);
	}
	return TaskPriority.Normal;
};

export const addWorkerTask = async ({ type, input, priority = getDefaultTaskPriority() }) => {
	if (process.env.NODE_ENV === 'test') {
		return null;
	}

	const workerTask = await createWorkerTask({ type: type, input: input, priority: priority });
	const message = Buffer.from(JSON.stringify({ id: workerTask.id, type: type, input: input }));

	ensureOpenChannel();
	openChannel.sendToQueue(taskQueueName, message, {
		deliveryMode: true,
		priority: priority,
	});

	await openChannel.waitForConfirms();
	return workerTask;
};
