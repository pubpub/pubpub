/* global _paq */
import React from 'react';
import Raven from 'raven-js';
import { hydrate } from 'react-dom';
import { FocusStyleManager } from '@blueprintjs/core';

export const hydrateWrapper = (Component)=> {
	if (typeof window !== 'undefined' && window.location.origin !== 'http://localhost:9001') {
		FocusStyleManager.onlyShowFocusOnTabs();

		/* Remove any leftover service workers from last PubPub instance */
		if (window.navigator && navigator.serviceWorker) {
			navigator.serviceWorker.getRegistrations()
			.then((registrations)=> {
				registrations.forEach((registration)=> {
					registration.unregister();
				});
			});
		}

		const initialData = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'));
		const isDev = window.location.origin.indexOf('localhost:') > -1;
		if (!isDev) {
			Raven.config('https://b4764efd07c240488d390c8343193208@sentry.io/197897').install();
			Raven.setUserContext({ username: initialData.loginData.slug });

			/* Matomo Code */
			_paq.push(['setDocumentTitle', `${document.domain}/${document.title}`]);
			_paq.push(['setCookieDomain', '*.pubpub.org']);
			_paq.push(['setDomains', ['*.pubpub.org']]);
			_paq.push(['trackPageView']);
			_paq.push(['enableLinkTracking']);
			_paq.push(['enableHeartBeatTimer']);
			const url = 'https://pubpub.innocraft.cloud/';
			_paq.push(['setTrackerUrl', `${url}piwik.php`]);
			_paq.push(['setSiteId', '1']);
			const doc = document; const g = doc.createElement('script'); const s = doc.getElementsByTagName('script')[0];
			g.type = 'text/javascript'; g.async = true; g.defer = true; g.src = `${url}piwik.js`; s.parentNode.insertBefore(g, s);
		}

		hydrate(<Component {...initialData} />, document.getElementById('root'));
	}
};

export const apiFetch = function(path, opts) {
	return fetch(path, {
		...opts,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		credentials: 'include',
	})
	.then((response)=> {
		if (!response.ok) {
			return response.json().then((err)=> { throw err; });
		}
		return response.json();
	});
};

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
		apiKey: 'AIzaSyBNlAp1EW5zhiPS8HWwXwZ8WMs-EdkMmKI',
		authDomain: 'pubpub-v4-dev-60334.firebaseapp.com',
		databaseURL: 'https://pubpub-v4-dev-60334.firebaseio.com',
		projectId: 'pubpub-v4-dev-60334',
		storageBucket: 'pubpub-v4-dev-60334.appspot.com',
		messagingSenderId: '410839613714'
	};

	if (typeof window === 'undefined') { return devConfig; }
	if (window.location.origin.indexOf('dev.pubpub.org') > -1) { return devConfig; }
	if (window.location.origin.indexOf('ssl.pubpub.org') > -1) { return devConfig; }
	if (window.location.origin.indexOf('localhost:') > -1) { return devConfig; }
	return prodConfig;
};

export const getResizedUrl = function(url, type, dimensions) {
	if (!url || url.indexOf('https://assets.pubpub.org/') === -1) { return url; }
	const extension = url.split('.').pop().toLowerCase();
	const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
	if (validExtensions.indexOf(extension) === -1) { return url; }

	const prefix = type ? `${type}/` : '';
	const filepath = url.replace('https://assets.pubpub.org/', '');
	return `https://resize.pubpub.org/${prefix}${dimensions}/${filepath}`;
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
	for (let index = 0; index < tokenLength; index += 1) {
		hash += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return hash;
}

export function getDefaultLayout(isPage) {
	if (isPage) {
		return [
			{
				id: 'kruw36cv',
				type: 'text',
				content: {
					text: undefined,
				},
			}
		];
	}
	return [
		{
			id: '0kyj32ay',
			type: 'pubs',
			content: {
				title: '',
				size: 'large',
				limit: 1,
				pubIds: []
			}
		},
		{
			id: 'gruw36cv',
			type: 'pubs',
			content: {
				title: '',
				size: 'medium',
				limit: 0,
				pubIds: []
			}
		},
		{
			id: 'kruw36cv',
			type: 'drafts',
			content: {
				title: 'Open Drafts',
			},
		}
	];
}

export function formatCitationString(item, callback) {
	fetch('/api/editor/citation-format', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			input: item
		}),
		credentials: 'include',
	})
	.then((response)=> {
		if (!response.ok) {
			return response.json().then((err)=> { throw err; });
		}
		return response.json();
	})
	.then((result) => {
		callback(result);
	})
	.catch((error) => {
		callback(error);
	});
}
export function renderLatexString(value, isBlock, callback) {
	fetch('/api/editor/latex-render', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			value: value,
			isBlock: isBlock,
		}),
		credentials: 'include',
	})
	.then((response)=> {
		if (!response.ok) {
			return response.json().then((err)=> { throw err; });
		}
		return response.json();
	})
	.then((result) => {
		callback(result);
	})
	.catch((error) => {
		callback(error);
	});
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
	getPolicy.addEventListener('load', beginUpload);
	getPolicy.open('GET', `/api/uploadPolicy?contentType=${file.type}`);
	getPolicy.send();
}

export function getRandomColor(loginId) {
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
	if (!loginId) { return colors[0]; }
	return colors[loginId.charCodeAt(loginId.length - 1) % colors.length];
}

export function generatePubBackground(pubTitle) {
	const gradients = [
		'linear-gradient(135deg, #cb2d3e, #ef973a)',
		'linear-gradient(-45deg, #00bf8f, #001510)',
		'linear-gradient(135deg, #2c3e50, #4ca1af)',
		'linear-gradient(-45deg, #ad5389, #3c1053)',
		'linear-gradient(135deg, #000046, #1cb5e0)',
		// 'linear-gradient(to right, rgba(116, 235, 213, 1), rgba(172, 182, 229, 1))',
		// 'linear-gradient(to right, rgba(225, 238, 195, 1), rgba(240, 80, 83, 1))',
		// 'linear-gradient(to right, rgba(34, 193, 195, 1), rgba(253, 187, 45, 1))',
		// 'linear-gradient(to right, rgba(217, 167, 199, 1), rgba(255, 252, 220, 1))',
		// 'linear-gradient(to right, rgba(201, 214, 255, 1), rgba(226, 226, 226, 1))'
	];

	if (!pubTitle) { return gradients[0]; }
	return gradients[pubTitle.charCodeAt(pubTitle.length - 1) % 5];
}
