// takes request with pub url and returns data from google
const app = require('../api');

// Google API required
// Should look into global authorization for the Google API
// requires node install of google apis

// Google API Key. Downloaded from Developer Console.
// Key has an email attached which needs view access to the G Analytics
const clientEmail = process.env.NODE_ENV !== 'production' && !process.env.TESTING ? require('../config').googleAPIKey.client_email : process.env.GOOGLE_API_CLIENT_EMAIL;
const privateKey = process.env.NODE_ENV !== 'production' && !process.env.TESTING ? require('../config').googleAPIKey.private_key : process.env.GOOGLE_API_PRIVATE_KEY;

// from node install of googleapis
import google from 'googleapis';

// Google analytics view ID from GA dev account explorer
const viewId = 'ga:113911431';

// GA authentication\authorization
const oauth2Client = new google.auth.OAuth2();

const jwtClient = new google.auth.JWT(
	clientEmail, null, privateKey,
	['https://www.googleapis.com/auth/analytics.readonly'], null);

let ganalytics = jwtClient.authorize(function(err, tokens) {
	if (err) {
		console.info(err);
		return err;
	}
	oauth2Client.setCredentials({access_token: tokens.access_token});
	google.options({ auth: oauth2Client });
	ganalytics = google.analyticsreporting('v4');
	return ganalytics;
});

export function analytics(req, res) {

	function arrayIsTrue(array) {
		for (const value of array) {
			if (!value) { return false; }
		}
		return true;
	}

	function objectKeyQuickSort(keys, object) {
		// note that this is descending order
		// note that pivot is leftmost
		if (keys.length === 0) {
			return [];
		}
		const left = [];
		const right = [];
		const pivot = keys[0];
		for (let index = 1; index < keys.length; index++) {
			if (object[keys[index]] > object[pivot]) {
				left.push(keys[index]);
			} else {
				right.push(keys[index]);
			}
		}
		return objectKeyQuickSort(left, object).concat(pivot, objectKeyQuickSort(right, object));
	}

	function getResponse(gReports) {
		// Response calculations here
		// Convert to however we want to store it in PubPub system

		// gReports param will be an array of the form:
		// [(array of reports of fields 1), (array of reports of fields 2)]
		
		// could load a data model here or something and store the response in it
		// this object could have reference pub or whatever sorting metadata

		// Should add better handle for empty reports from invalid request
		if (!gReports[0][0].data.rows) {
			return res.status(500).json('Request not found');
		}

		// TOCLIENT Response

		// Data from first report
		let totalViews = 0;
		let totalUniqueViews = 0;
		let totalReadTime = 0;

		let totalViewsYear = 0;
		let totalViewsMonth = 0;
		let totalViewsWeek = 0;
		let totalViewsDay = 0;

		const dateViews = {};
		const dateViewsArray = [];

		gReports[0].forEach( function(report) {
			//Summing Totals
			totalViews += parseFloat(report.data.totals[0].values[0]);
			totalUniqueViews += parseFloat(report.data.totals[0].values[1]);
			totalReadTime += parseFloat(report.data.totals[0].values[2]);

			//Consolidating Dateviews
			report.data.rows.forEach( function(row) {
				if (dateViews[row.dimensions[0]]) {
					dateViews[row.dimensions[0]] += parseFloat(row.metrics[0].values[0]);
				} else {
					dateViews[row.dimensions[0]] = parseFloat(row.metrics[0].values[0]);
				}
			});
		});

		let maxTime = 0;

		// Converts Object to easily plotted arrays
		for (const key of Object.keys(dateViews)) {
			// 
			const raw = key.toString();
			const day = raw.substring(raw.length - 2, raw.length);
			const month = raw.substring(raw.length - 4, raw.length - 2);
			const year = raw.substring(0, raw.length - 4);
			const date = new Date(year, month, day);
			// Fills 0 view dates with values for graph
			if (dateViewsArray.length >= 1) {
				while (date.getTime() - dateViewsArray[dateViewsArray.length - 1][0] > 86400000) {
					dateViewsArray.push([dateViewsArray[dateViewsArray.length - 1][0] + 86400000, 0]);
				}
			}
			const difTime = new Date().getTime() - date.getTime();
			if (difTime <= 86400000*365) {
				totalViewsYear += dateViews[key];
				if (difTime <= 86400000*28) {
					totalViewsMonth += dateViews[key];
					if (difTime <= 86400000*7) {
						totalViewsWeek += dateViews[key];
						if (difTime <= 86400000) {
							totalViewsDay += dateViews[key];
						}
					}
				}
			}
			if (difTime > maxTime) {
				maxTime = difTime;
			}
			dateViewsArray.push([date.getTime(), dateViews[key]]);
		}

		// Data from second report
		const countryTotalViews = {};
		let countryOrder = [];
		const continentTotalViews = {};
		let continentOrder = [];
		const cityTotalViews = {};
		let cityOrder = [];

		gReports[1].forEach( function(report) {
			report.data.rows.forEach( function(row) {
				if (countryTotalViews[row.dimensions[0]]) {
					countryTotalViews[row.dimensions[0]] += parseFloat(row.metrics[0].values[0]);
				} else {
					countryTotalViews[row.dimensions[0]] = parseFloat(row.metrics[0].values[0]);
				}
				if (continentTotalViews[row.dimensions[1]]) {
					continentTotalViews[row.dimensions[1]] += parseFloat(row.metrics[0].values[0]);
				} else {
					continentTotalViews[row.dimensions[1]] = parseFloat(row.metrics[0].values[0]);
				}
				if (cityTotalViews[row.dimensions[2]]) {
					cityTotalViews[row.dimensions[2]] += parseFloat(row.metrics[0].values[0]);
				} else {
					cityTotalViews[row.dimensions[2]] = parseFloat(row.metrics[0].values[0]);
				}
			});
		});
		for (const key of Object.keys(countryTotalViews)) {
			countryOrder.push(key);
		}
		for (const key of Object.keys(continentTotalViews)) {
			continentOrder.push(key);
		}
		for (const key of Object.keys(cityTotalViews)) {
			cityOrder.push(key);
		}
		countryOrder = objectKeyQuickSort(countryOrder, countryTotalViews);
		continentOrder = objectKeyQuickSort(continentOrder, continentTotalViews);
		cityOrder = objectKeyQuickSort(cityOrder, cityTotalViews);

		const response = {
			// DevDebugReports
			gReports: gReports,
			
			// Data Totals
			totalViews: totalViews,
			totalUniqueViews: totalUniqueViews,
			totalReturnViews: totalViews - totalUniqueViews, // Returning Readers sounds nice.
			totalReadTime: totalReadTime, // Session Duration in seconds.
			averageReadTime: totalReadTime / totalViews,

			totalViewsYear: totalViewsYear,
			totalViewsMonth: totalViewsMonth,
			totalViewsWeek: totalViewsWeek,
			totalViewsDay: totalViewsDay,

			totalViewsAveYear: Math.round(86400000*365*totalViews/maxTime),
			totalViewsAveMonth: Math.round(86400000*28*totalViews/maxTime),
			totalViewsAveWeek: Math.round(86400000*7*totalViews/maxTime),
			totalViewsAveDay: Math.round(86400000*totalViews/maxTime),
			
			// Data OverTime
			dateViews: dateViews,
			dateViewsArray: dateViewsArray,
			
			// Data PerLocation
			countryTotalViews: countryTotalViews,
			countryOrder: countryOrder,
			continentTotalViews: continentTotalViews,
			continentOrder: continentOrder,
			cityTotalViews: cityTotalViews,
			cityOrder: cityOrder,
		};
		return res.status(201).json(response);
	}

	// Request object uniform parameters

	// Inputs from the client
	const input = req.body.input; // input text from analytics page
	const item = req.body.item; // input drop down from analytics page

	// These are required uniformity to make multiple requests
	// could change start-date to pub creation, using pub model and pub.findone
	const startDate = '2005-01-01';
	const endDate = 'yesterday';

	// This is to allow more complex filters (such as all of a user's pubs, etc)
	// 										^this probably wont matter cause it will get broken up to pulling from the server, but for now
	let filter = '';
	if (item === 'pub') {
		filter = 'ga:pagePath==/pub/' + input;
	}
	if (item === 'journal') {
		// this doesnt work for most things. works for viral domain tho
		// Works for subdomain journals. Tracks all pubs on that domain
		filter = 'ga:hostname==' + input + '.pubpub.org';
	}

	// RECURSION INITIAL STATE
	// initials should have length equal to length of report requests
	const initialReports = [[], []];
	const initialNextPageTokens = [undefined, undefined];

	// RECURSION HERE
	// returns data for processing
	function queryData(gReports, nextPageTokens, initialQuery) { // json [[r1p1,r1p2], [r2p1]], string [token1, token2], boolean

		// Sets a dummy gReq if the full response is already obtained
		// console.info(nextPageTokens)
		const dummyReqCheck = [];
		nextPageTokens.forEach( function(token) {
			if (token === undefined && initialQuery === false) {
				dummyReqCheck.push(true);
			} else {
				dummyReqCheck.push(false);
			}
		});

		// If they are all dummy requests, we are done requesting
		if (arrayIsTrue(dummyReqCheck)) {
			console.log('Finished Query');
			return getResponse(gReports);
		}

		const gReq = {
			reportRequests: [
				{
					// Metrics vs Time 
					viewId: viewId,
					dateRanges: [{
						startDate: startDate,
						endDate: endDate,
					}],
					dimensions: [{
						name: 'ga:date'
					}],
					metrics: [
						{
							expression: 'ga:pageviews'
						},
						{
							expression: 'ga:uniquePageViews'
						},
						{
							expression: 'ga:sessionDuration'
						}
					],
					orderBys: [{
						fieldName: 'ga:pageviews',
						sortOrder: 'DESCENDING'
					}],
					filtersExpression: filter,
					pageToken: nextPageTokens[0],
					pageSize: 10000,
				},
				{
					// Metrics vs Location
					viewId: viewId,
					dateRanges: [{
						startDate: startDate,
						endDate: endDate,
					}],
					dimensions: [
						{
							name: 'ga:country'
						},
						{
							name: 'ga:continent'
						},
						{
							name: 'ga:city'
						}
					],
					metrics: [
						{
							expression: 'ga:pageviews'
						},
						{
							expression: 'ga:uniquePageViews'
						},
						{
							expression: 'ga:sessionDuration'
						}
					],
					orderBys: [{
						fieldName: 'ga:pageviews',
						sortOrder: 'DESCENDING'
					}],
					filtersExpression: filter,
					pageToken: nextPageTokens[1],
					pageSize: 10000,
				}
			],
		};

		for (let index = 0; index < dummyReqCheck.length; index++) {
			if (dummyReqCheck[index]) {
				gReq.reportRequests[index] = {
					viewId: viewId,
					dateRanges: [{
						startDate: startDate,
						endDate: endDate,
					}],
					pageSize: 1,
				};
			}
		}
	
		// request object
		const gRequest = {
			'headers': {'Content-Type': 'application/json'},
			'auth': oauth2Client,
			'resource': gReq,
		};

		// This is the query. This is where google response is recieved.
		ganalytics.reports.batchGet(gRequest, function(err, gResponse) {
			if (err) {
				console.info(err);
				return res.status(500).json(err);
			}
			// Update function inputs
			for (let index = 0; index < gResponse.reports.length; index++) {
				if (!dummyReqCheck[index]) {
					// Add response reports to gReports
					gReports[index].push(gResponse.reports[index]);
					// Set next page tokens. Undefined if no further.
					nextPageTokens[index] = gResponse.reports[index].nextPageToken;
				} else {
					// Dummy page tokens should be undefined, but this is for safety
					nextPageTokens[index] = undefined;
				}
			}
			return queryData(gReports, nextPageTokens, false);
		});
	}
	return queryData(initialReports, initialNextPageTokens, true);
}
app.post('/analytics', analytics);
