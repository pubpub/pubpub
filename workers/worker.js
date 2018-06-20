/* eslint-disable global-require */
import exportTask from './exportTask';
import importTask from './importTask';
import analyticsTask from './analyticsTask';
import amqplib from 'amqplib';

if (process.env.NODE_ENV !== 'production') {
	require('../server/config.js');
}

// exportTask('3ecac2f5-8065-4bde-aa0e-c1ab222fd673', '468e94cb-a894-40b6-9a78-78ab7bda5798', 'docx');
// exportTask('3ecac2f5-8065-4bde-aa0e-c1ab222fd673', '468e94cb-a894-40b6-9a78-78ab7bda5798', 'pdf');
// exportTask('3ecac2f5-8065-4bde-aa0e-c1ab222fd673', '468e94cb-a894-40b6-9a78-78ab7bda5798', 'epub');
// exportTask('3ecac2f5-8065-4bde-aa0e-c1ab222fd673', '468e94cb-a894-40b6-9a78-78ab7bda5798', 'html');
// exportTask('3ecac2f5-8065-4bde-aa0e-c1ab222fd673', '468e94cb-a894-40b6-9a78-78ab7bda5798', 'markdown');
// exportTask('3ecac2f5-8065-4bde-aa0e-c1ab222fd673', '468e94cb-a894-40b6-9a78-78ab7bda5798', 'odt');
// exportTask('3ecac2f5-8065-4bde-aa0e-c1ab222fd673', '468e94cb-a894-40b6-9a78-78ab7bda5798', 'plain');
// exportTask('3ecac2f5-8065-4bde-aa0e-c1ab222fd673', '468e94cb-a894-40b6-9a78-78ab7bda5798', 'jats');
// exportTask('3ecac2f5-8065-4bde-aa0e-c1ab222fd673', '468e94cb-a894-40b6-9a78-78ab7bda5798', 'tex');
importTask('3ecac2f5-8065-4bde-aa0e-c1ab222fd673', 'https://assets.pubpub.org/ywh5c35b/61529509039692.docx');
// analyticsTask();



// const queueName = 'pubpubTaskQueue';
// let openChannel;
// amqplib.connect(process.env.CLOUDAMQP_URL).then((conn)=> {
// 	return conn.createChannel().then((channel)=> {
// 		return channel.assertQueue(queueName, { durable: true })
// 		.then(()=> {
// 			openChannel = channel;
// 		})
// 		.then(()=> {
// 			addMessage('Hello!');
// 		});
// 	});
// });

// amqplib.connect(process.env.CLOUDAMQP_URL).then((conn)=> {
// 	process.once('SIGINT', ()=> { conn.close(); });
// 	return conn.createChannel().then((ch)=> {
// 		let ok = ch.assertQueue('pubpubTaskQueue', { durable: true });
// 		ok = ok.then(()=> { ch.prefetch(1); });
// 		ok = ok.then(()=> {
// 			ch.consume('pubpubTaskQueue', processTask(ch), { noAck: false });
// 			console.log(' [*] Waiting for messages. To exit press CTRL+C');
// 		});
// 		return ok;
// 	});
// })
// .catch(console.warn);


// const addMessage = (message)=> {
// 	return openChannel.sendToQueue(queueName, Buffer.from(message), { deliveryMode: true });
// };

// const processTask = (channel)=> {
// 	return (msg)=> {
// 		console.log('Got a message ', msg);
// 		console.log('Body ', msg.content.toString());
// 	};
// };
