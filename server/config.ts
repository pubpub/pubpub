import dotenv from 'dotenv';

dotenv.config();

const getVal = (varKey) => {
	const useProduction = process.env.PUBPUB_PRODUCTION === 'true';
	return useProduction ? process.env[`${varKey}_v6Prod`] : process.env[`${varKey}_v6Dev`];
};

process.env.DATABASE_URL = getVal('DATABASE_URL');
process.env.CLOUDAMQP_APIKEY = getVal('CLOUDAMQP_APIKEY');
process.env.CLOUDAMQP_URL = getVal('CLOUDAMQP_URL');
process.env.ALGOLIA_ID = getVal('ALGOLIA_ID');
process.env.ALGOLIA_KEY = getVal('ALGOLIA_KEY');
process.env.ALGOLIA_SEARCH_KEY = getVal('ALGOLIA_SEARCH_KEY');
