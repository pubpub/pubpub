# PubPub 

Open Reading, Writing, and Publishing

## Installation

```
npm install
```

## Running Dev Server

```
npm run dev
```

## Building and Running Production Server

```
npm run build
npm run start
```

## Deploying to Heroku

```
heroku create
heroku config:set NODE_ENV=production
heroku config:set NODE_PATH=./src
heroku config:set NPM_CONFIG_PRODUCTION=false
heroku config:set mongoURI=<MONGOURI>
git push heroku master
heroku ps:scale web=1
```

# Docs
- [All docs](/docs)
- [API](/docs/api)


# Testing
Tests run using Mocha and Karma. All test files follow the pattern `filename.test.js`.

To run tests:

```
npm install
npm run test
```

Local API tests start an instance of mongodb to confirm database behavior.
For best practices testing React and Redux components, see https://github.com/reactjs/redux/blob/master/docs/recipes/WritingTests.md


