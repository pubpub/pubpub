# PubPub

## Install & run

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

# Repo Architecture

## Containers

The Containers folder is used for ['smart components'](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.pnw7tliip).

These containers are connected to the redux store (i.e. they are pushed new props when the store updates) and are capable of dispatching actions. 

## Components

The Components folder is used for globally used components.

Components that are specific to a given view live within its associated container folder (e.g. a component only used in the UserProfile container, lives within that container. e.g. `containers/UserProfile/UserProfileSettings`).


# Journals

## Custom domains
To add a custom domain, changes must be made in three places: 

1. In the CORS configuration of server.js in the [pubpub-api repo](https://github.com/pubpub/pubpub-api)
2. A domain alias must be added to on your hosting platform. 
3. The full url (e.g. `https://www.journal.com`) with no trailing slash must be added to the customDomain column of the Journals table
