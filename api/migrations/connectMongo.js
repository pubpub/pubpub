import mongoose from 'mongoose';


const mongoURI = require('../authentication/mongoCredentials').clonedProdMongoURI;
mongoose.connect(mongoURI);
/*
if (process.env.NODE_ENV !== 'production') {
	const mongoURI = require('../authentication/mongoCredentials').clonedProdMongoURI;
	mongoose.connect(mongoURI);
} else {
	mongoose.connect(process.env.mongoURI);
}
*/

export default mongoose;
