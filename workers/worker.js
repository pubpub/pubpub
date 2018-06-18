/* eslint-disable global-require */
import exportTask from './exportTask';
import importTask from './importTask';
import analyticsTask from './analyticsTask';
import amqplib from 'amqplib';

if (process.env.NODE_ENV !== 'production') {
	require('../server/config.js');
}

exportTask('resisting-reduction');
importTask();
analyticsTask();


const queueName = 'pubpubTaskQueue';
let openChannel;
amqplib.connect(process.env.CLOUDAMQP_URL).then((conn)=> {
	return conn.createChannel().then((channel)=> {
		return channel.assertQueue(queueName, { durable: true })
		.then(()=> {
			openChannel = channel;
		})
		.then(()=> {
			addMessage('Hello!');
		});
	});
});

amqplib.connect(process.env.CLOUDAMQP_URL).then((conn)=> {
	process.once('SIGINT', ()=> { conn.close(); });
	return conn.createChannel().then((ch)=> {
		let ok = ch.assertQueue('pubpubTaskQueue', { durable: true });
		ok = ok.then(()=> { ch.prefetch(1); });
		ok = ok.then(()=> {
			ch.consume('pubpubTaskQueue', processTask(ch), { noAck: false });
			console.log(' [*] Waiting for messages. To exit press CTRL+C');
		});
		return ok;
	});
})
.catch(console.warn);


const addMessage = (message)=> {
	return openChannel.sendToQueue(queueName, Buffer.from(message), { deliveryMode: true });
};

const processTask = (channel)=> {
	return (msg)=> {
		console.log('Got a message ', msg);
		console.log('Body ', msg.content.toString());
	};
};
