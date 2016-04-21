import request from 'superagent';

const recURL = 'http://pubrecommend.herokuapp.com/';

/*
 * Feature a Pub
 * @param: {string} jounralId - The journal's id
 * @param: {string} pubId - pub's id to be featured
 * @callback: callback
 *
 */

export function featurePub(journalID, pub, callback) {
	request
	.post(recURL + journalID)
	.send({
		pub: pub,
		actions: ['feature'],
	})
  .set('Accept', 'application/json')
	.end(callback);
}

/**
 * Get recommendations by Pub or by User
 * @param: {string} type - Type to get recommendations by
 *         either 'user' or 'pub'
 * @param: {string} query - The query to get recommendations for
 *         either a pub's ID or a user's ID
 * @param: {string} journalId - The journal's id
 *
 * @callback : callback
 * @param: {object[]} recommendations - Recommendations per requested
 *
 */
export function getRecommendations(type, query, journalId, callback) {
	let recQuery = {};

	if (type === 'user') {
		recQuery = {user: query};
	} else {
		recQuery = {pub: query};
	}

	const recStr = (journalId) ? recURL + journalId : recURL + 'pubpub';

	request
	.get(recStr)
	.query(recQuery)
  .set('Accept', 'application/json')
	.end(callback);
}

/**
 * Record an action to recommendation backend
 * @param: {string} jounralId - The journal's ID
 * @param: {string} pubId - The pub's ID
 * @param: {string} userId - The user's ID
 * @param: {string} action - The action to be recorded
 * @callback: callback
 */
// TODO: Rewrite action as a list of string to reduce the number of requests
export function inpRecAction(journalId, pubId, userId, action, callback) {
	request
	.post(recURL + journalId)
	.send({
		user: userId,
		pub: pubId,
		actions: action
	})
  .set('Accept', 'application/json')
	.end(callback);
}

/**
 * Remove previous actions from recommendation backend
 * @param: {string} journalId - The journal's ID
 * @param: {string} pubId - The pub's ID
 * @param: {string} userId - The user's ID
 * @param: {string} action - Action to be removed
 * @callback: callback
 */

export function removeAction(journalId, pubId, userId, action, callback) {
	request
	.del(recURL + journalId)
	.send({
		user: userId,
		pub: pubId,
		action: action
	})
  .set('Accept', 'application/json')
	.end(callback);
}
