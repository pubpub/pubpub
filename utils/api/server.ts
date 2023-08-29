import { initServer } from '@ts-rest/express';
import { contract } from './contract';

const s = initServer();

export const server = s.router(contract, {
	pub: {
		create: async ({ body, req, res }) => {
			return {
				body: {},
				status: 201,
			};
		},
	},
});
