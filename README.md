# PubPub

## Install & run

```
npm i && npm start
```

Go to `http://localhost:3000/`.

## Build

```
npm run build
```

This will create a `dist/` folder with a minified js bundle which will be used on any environment which isn't undefined (i.e. not local).

```
npm run start-prod
```

This will build and then run your app with environment set to production, so that the production bundle and `config/production.js` are used.

---

Based on the boilerplate from https://github.com/DominicTobias/universal-react/