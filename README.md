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







