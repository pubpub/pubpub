import supertest from 'supertest';
import { UserWithPrivateFieldsAndHashedPassword } from 'types';

import app from '../server/server';

const userToAgentMap = new Map();
const loggedOutAgent = supertest.agent(app);

export const login = async (user?: UserWithPrivateFieldsAndHashedPassword) => {
	if (!user) {
		return loggedOutAgent;
	}
	if (userToAgentMap.get(user)) {
		return userToAgentMap.get(user);
	}

	const createAgent = async () => {
		const agent = supertest.agent(app);
		try {
			await agent.post('/api/login').send({
				email: user.email,
				password: user.sha3hashedPassword,
			});
			return agent;
		} catch (err) {
			throw new Error(`Failed to log in user ${user.email}: ${err}`);
		}
	};

	const entry = await createAgent();
	userToAgentMap.set(user, entry);
	return entry;
};

export const clearUserToAgentMap = () => userToAgentMap.clear();
