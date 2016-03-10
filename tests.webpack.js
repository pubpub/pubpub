import chai from 'chai';  
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);  

var context = require.context('./src', true, /\.test\.js$/);
context.keys().forEach(context);
