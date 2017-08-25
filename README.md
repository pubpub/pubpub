# PubPub v4

Collaborative Community Publishing


## To Install

```
npm install
```

## To Run Dev Mode

```
npm start
```

## Storybook

To build and test components, we use Storybook. To run:

```
npm run storybook
```

Navigate to `localhost:9001`	

## To Build and Run Production Version

```
npm run prod
```

Navigate to `localhost:5000`

# Static Files

Static files such as images, robots.txt, etc are stored in the /static folder. The contents of this folder are copied to the /dist folder during the production build. The contents, not the folder itself, are copied, so that robots.txt, etc will be at the top-level of the deployed application.
