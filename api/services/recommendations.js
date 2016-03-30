import request from 'superagent';

const recURL = env.process.RECOMMENDURL;

export function featurePub(journalID, pub, callback) {
  request
  .post(recURL + journalID)
  .send({
    pub : pub,
    action: 'featured'
  })
  .end(callback);
};

export function getRecommendations(type, query, journalId, callback){
  let recQuery = {}; 
  
  if (type === 'user') {
    recQuery = {user : query}
  } else {
    recQuery = {pub : query}
  }

  request
  .get(recURl + journalId)
  .query(recQuery)
  .end(callback);
} 


export function inpRecAction(journalId, pubId, userId, action, callback){ 
  request
  .post(recURL + journalId)
  .send({
    user   : userId,
    pub    : pubId,
    action : action
  })
  .end(callback);
}

export function removeAction(journalId, pubId, userId, action, callback){
  request
  .del(recURL + jounralId)
  .send({
    user   : userId,
    pub    : pubId,
    action : action
  })
  .end(callback);
