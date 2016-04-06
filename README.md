# PubPub

PubPub is a platform for open reading, writing, and publishing.
For more details, see [http://www.pubpub.org/pub/about](http://www.pubpub.org/pub/about).

## Getting Started

PubPub can be run on your own local machines or controlled servers. There are a few external dependencies which must first be configured. See [/api/config.sample.js](/api/config.sample.js) to configure these services. We strive to make PubPub completely independent from any external proprietary services, but our team is still small, so for the moment it is necessary.

Once the services are configured, run the following commands to install packages and run the dev server. Note, you will need [https://nodejs.org/en/download/](node and npm) installed on your machine:
```
npm install
npm run dev
```


## Building and Running Production Server

```
npm run build
npm run start
```

## Deploying to Heroku
For testing or production services, PubPub deploys easily to Heroku. A few config variables must be set:
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
...we need more work on our docs - coming very soon.
- [All docs](/docs)
- [API](/docs/api)


# Testing
Tests run using Mocha and Karma. All test files follow the pattern `filename.test.js`.

To run tests:

```
npm install
npm run test        # test client and server code with mocha
npm run test-karma  # test client code with karma (real browsers)
```

[More on tests](/tests)
