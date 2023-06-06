import supertest from 'supertest-as-promised';
import { UserWithPrivateFieldsAndHashedPassword } from 'types';

import app from '../server/server';

const userToAgentMap = new Map();
const loggedOutAgent = supertest.agent(app);

export const login = (user?: UserWithPrivateFieldsAndHashedPassword) => {
	if (!user) {
		return loggedOutAgent;
	}
	if (userToAgentMap.get(user)) {
		return userToAgentMap.get(user);
	}
	const entry = new Promise((resolve, reject) => {
		const agent = supertest.agent(app);
		agent
			.post('/api/login')
			.send({
				email: user.email,
				password: user.sha3hashedPassword,
			})
			.end((err) => {
				if (err) {
					return reject(err);
				}
				return resolve(agent);
			});
	});

	userToAgentMap.set(user, entry);
	return entry;
};

export const clearUserToAgentMap = () => userToAgentMap.clear();
