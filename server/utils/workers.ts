import amqplib from 'amqplib';

import { TaskPriority, taskQueueName } from 'utils/workers';
import { createWorkerTask } from 'server/workerTask/queries';

let openChannelPromise;

const createChannel = async () => {
	const amqpUrl = process.env.CLOUDAMQP_URL;

	if (!amqpUrl) {
		throw new Error('CLOUDAMQP_URL environment variable not set');
	}

	const connection = await amqplib.connect(amqpUrl);
	const channel = await connection.createConfirmChannel();
	await channel.assertQueue(taskQueueName, { durable: true, maxPriority: TaskPriority.Highest });
	channel.on('close', (err) => {
		console.error('Worker channel closed:', err);
		openChannelPromise = null;
	});
	return channel;
};

const getDefaultTaskPriority = () => {
	const processPriorty = process.env.DEFAULT_QUEUE_TASK_PRIORITY;
	if (processPriorty) {
		return parseInt(processPriorty, 10);
	}
	return TaskPriority.Normal;
};

const getOrCreateOpenChannel = async () => {
	if (process.env.NODE_ENV === 'test') {
		return {
			sendToQueue: () => {},
			waitForConfirms: () => {},
		};
	}
	if (!openChannelPromise) {
		openChannelPromise = createChannel();
	}
	return openChannelPromise;
};

getOrCreateOpenChannel();

export const sendMessageToOpenChannel = async (message: Buffer, priority: number) => {
	const openChannel = await getOrCreateOpenChannel();
	openChannel.sendToQueue(taskQueueName, message, {
		deliveryMode: true,
		priority,
	});
	await openChannel.waitForConfirms();
};

export const addWorkerTask = async ({
	type,
	input,
	priority = getDefaultTaskPriority(),
}: {
	type: 'import' | 'export' | 'archive';
	input;
	priority?: number;
}) => {
	const workerTask = await createWorkerTask({ type, input, priority });
	const message = Buffer.from(JSON.stringify({ id: workerTask.id, type, input }));
	await sendMessageToOpenChannel(message, priority);
	return workerTask;
};
