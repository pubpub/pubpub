/* global it, expect, beforeAll */
import { setup, login, modelize } from 'stubstub';

const models = modelize`
	Community {
		Member {
			permissions: "manage"
			User communityManager {}
		}
		Pub sourcePub {
			Member {
				permissions: "manage"
				User sourcePubManager {}
			}
			Member {
				permissions: "edit"
				User sourcePubEditor {}
			}
		}
	}
	Community anotherCommunity {
		Pub targetPub {
			Member {
				permissions: "manage"
				User targetPubManager {}
			}
		}
	}
`;

setup(beforeAll, async () => {
	await models.resolve();
});

it('does not create a PubEdge for a user with edit permissions', async () => {
	const { sourcePubEditor, sourcePub, targetPub } = models;
	const agent = await login(sourcePubEditor);
	await agent
		.post('/api/pubEdges')
		.send({
			pubId: sourcePub.id,
			relationType: 'review',
			pubIsParent: true,
			targetPubId: targetPub,
		})
		.expect(403);
});

it('does not let a manager create a Pub targeting their Pub', async () => {
	const { targetPubManager, sourcePub, targetPub } = models;
	const agent = await login(targetPubManager);
	await agent
		.post('/api/pubEdges')
		.send({
			pubId: sourcePub.id,
			relationType: 'review',
			pubIsParent: true,
			targetPubId: targetPub.id,
		})
		.expect(403);
});

// Manager can create a PubEdge to another Pub
// Managers can create a PubEdge to a foreign publication
// Edges created by a Community manager are automatically approved
// Manager can update rank
// Target manager can update approvedByTarget but nothing else
// Manager can destroy a PubEdge
