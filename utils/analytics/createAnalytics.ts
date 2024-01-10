// import { Analytics } from 'analytics';
import googleAnalytics from '@analytics/google-analytics';
// @ts-expect-error h
import { Analytics } from '@analytics/core';
import googleTagPlugin from '@analytics/google-tag-manager';

const ourGID = 'G-9GK39XDD27';

export const createAnalytics = (
	{ gid, appname = 'pubpub' }: { gid?: string | string[]; appname?: string } = {
		appname: 'pubpub',
	},
) => {
	// console.log(Analytics);
	// console.log('createAnalytics', gid, appname);

	const analytics = Analytics({
		app: appname,
		debug: true,
		plugins: [
			// googleAnalytics({
			// 	measurementIds: Array.isArray(gid) ? gid : [gid || ourGID],
			// }),
			googleTagPlugin({
				containerId: 'GTM-N4VSLDB7',
			}),
		],
	});

	return analytics;
};
