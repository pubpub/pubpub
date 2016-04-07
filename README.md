# PubPub

PubPub is a platform for open reading, writing, and publishing.

PubPub is open to all and available at [www.pubpub.org](http://www.pubpub.org)

For more details, see [http://www.pubpub.org/pub/about](http://www.pubpub.org/pub/about).

## Getting Started

PubPub can be run on your own local machines or controlled servers. There are a few external dependencies which must first be configured. See [/api/config.sample.js](/api/config.sample.js) to configure these services. We strive to make PubPub completely independent from any external proprietary services, but our team is still small, so for the moment it is necessary.

Once the services are configured, run the following commands to install packages and run the dev server. Note, you will need [https://nodejs.org/en/download/](node and npm) installed on your machine:
```
npm install
npm run dev
```

PubPub is built with react, redux, node, express, and mongoose. For great react/redux testing, we use [https://github.com/gaearon/redux-devtools](Redux devtools). We suggest installing the [https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd](chrome extension) for a less popup-y dev environment.

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

Most documentation is spread throughout the project alongside the code it is describing. The [DOCUMENTATION.md](./DOCUMENTATION.md) file aggregates those READMEs for easy navigation.

## Updates and Roadmap
Changes to the project and future features are documented in the Changelog:

[CHANGELOG.md](./CHANGELOG.md)


## Contributing
We welcome contributions to PubPub in the form of feedback, bug reports, feature ideas, and code!

Contributing guidelines are documented in [CONTRIBUTING.md](./CONTRIBUTING.md)

# Testing
Tests run using Mocha and Karma. All test files follow the pattern `filename.test.js`.

To run tests:

```
npm install
npm run test        # test client and server code with mocha
npm run test-karma  # test client code with karma (real browsers)
```

[More on tests](/src/tests)
