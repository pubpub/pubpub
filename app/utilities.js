import fetch from 'isomorphic-fetch';

export const getFirebaseConfig = function() {
	const prodConfig = {
		apiKey: 'AIzaSyAkqGZZVlMiRzVyROlOwMUSbtbdHFPza7o',
		authDomain: 'pubpub-v4-prod.firebaseapp.com',
		databaseURL: 'https://pubpub-v4-prod.firebaseio.com',
		projectId: 'pubpub-v4-prod',
		storageBucket: 'pubpub-v4-prod.appspot.com',
		messagingSenderId: '955699971712'
	};
	const devConfig = {
		apiKey: 'AIzaSyDGttY0gbzGUhrrUD9f9bllMxmYWl3WWoc',
		authDomain: 'pubpub-v4-dev.firebaseapp.com',
		databaseURL: 'https://pubpub-v4-dev.firebaseio.com',
		projectId: 'pubpub-v4-dev',
		storageBucket: 'pubpub-v4-dev.appspot.com',
		messagingSenderId: '175246944410'
	};

	if (window.location.origin.indexOf('dev.pubpub.org') > -1) { return devConfig; }
	if (window.location.origin.indexOf('localhost:') > -1) { return devConfig; }
	return prodConfig;
};

export const apiFetch = function(path, opts) {
	let urlPrefix = 'https://v4-api.pubpub.org';
	if (window.location.origin.indexOf('dev.pubpub.org') > -1) {
		urlPrefix = 'https://pubpub-api-v4-dev.herokuapp.com';
	}
	if (window.location.origin.indexOf('localhost:') > -1) {
		urlPrefix = 'http://localhost:9876';
	}
	// Safari has to use a redirect since it doesn't allow 3rd party cookies
	// This means they'll have to login to every pubpub community.
	// Not sure why this is working with v3 despite the non-local urls...
	// if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
	// 	urlPrefix = `${window.location.origin}/api`;
	// }

	const finalRoute = `${urlPrefix}${path}`;

	return fetch(finalRoute, {
		...opts,
		credentials: 'include',
	})
	.then((response)=> {
		if (!response.ok) {
			return response.json().then((err)=> { throw err; });
		}
		return response.json();
	});
};

export const nestDiscussionsToThreads = function(discussions) {
	const maxThreadNumber = discussions.reduce((prev, curr)=> {
		if (curr.threadNumber > prev) { return curr.threadNumber; }
		return prev;
	}, 0);

	const tempThreads = new Array(maxThreadNumber).fill([]);
	discussions.forEach((item)=> {
		tempThreads[item.threadNumber - 1] = [...tempThreads[item.threadNumber - 1], item];
	});

	return tempThreads.filter((item)=> { return item.length; });
};

export const populateNavigationIds = function(collections, navigation) {
	const collectionsObject = {};
	collections.forEach((item)=> {
		collectionsObject[item.id] = item;
	});
	return navigation.map((item)=> {
		if (item.children) {
			return {
				...item,
				children: item.children.map((child)=> {
					return collectionsObject[child];
				}).filter((child)=> {
					return !!child;
				})
			};
		}
		return collectionsObject[item];
	}).filter((item)=> {
		if (!item) { return false; }
		if (item.children && !item.children.length) { return false; }
		return true;
	});
};

export function generateHash(length) {
	const tokenLength = length || 32;
	const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

	let hash = '';
	for (let index = 0; index < tokenLength; index++) {
		hash += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return hash;
}

export function s3Upload(file, progressEvent, finishEvent, index) {
	function beginUpload() {
		const folderName = window.location.hostname !== 'localhost' && window.location.hostname !== 'dev.pubpub.org'
			? generateHash(8)
			: '_testing';

		const extension = file.name !== undefined ? file.name.substr((~-file.name.lastIndexOf('.') >>> 0) + 2) : 'jpg';

		// const filename = folderName + '/' + new Date().getTime() + '.' + extension;
		const filename = folderName + '/' + (Math.floor(Math.random() * 8)) + new Date().getTime() + '.' + extension;
		const fileType = file.type !== undefined ? file.type : 'image/jpeg';
		const formData = new FormData();

		formData.append('key', filename);
		formData.append('AWSAccessKeyId', 'AKIAJQ5MNLCTIMY2ZF7Q');
		formData.append('acl', 'public-read');
		formData.append('policy', JSON.parse(this.responseText).policy);
		formData.append('signature', JSON.parse(this.responseText).signature);
		formData.append('Content-Type', fileType);
		formData.append('success_action_status', '200');
		formData.append('file', file);
		const sendFile = new XMLHttpRequest();
		sendFile.upload.addEventListener('progress', (evt)=>{
			progressEvent(evt, index);
		}, false);
		sendFile.upload.addEventListener('load', (evt)=>{
			finishEvent(evt, index, file.type, filename, file.name);
		}, false);
		sendFile.open('POST', 'https://s3-external-1.amazonaws.com/assets.pubpub.org', true);
		sendFile.send(formData);
	}

	const getPolicy = new XMLHttpRequest();
	const urlPrefix = window.location.origin.indexOf('localhost:') > -1
		? 'http://localhost:9876'
		: 'https://pubpub-api-v4-dev.herokuapp.com';
	getPolicy.addEventListener('load', beginUpload);
	getPolicy.open('GET', `${urlPrefix}/uploadPolicy?contentType=${file.type}`);
	getPolicy.send();
}

export function getRandomColor() {
	const colors = [
		'244,67,54',
		'63,81,181',
		'0,150,136',
		'255,152,0',
		'96,125,139',
		'233,30,99',
		'3,169,244',
		'156,39,176',
		'139,195,74',
		'103,58,183',
		'121,85,72',
		'33,150,243',
		'255,193,7',
		'0,188,212',
		'76,175,80',
		'205,220,57',
		'255,87,34',
	];
	return colors[Math.floor(Math.random() * colors.length)];
}
