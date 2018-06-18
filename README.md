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
Navigate to `localhost:9876`

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

Navigate to `localhost:9876`


# Pandoc

## Latex
The [Latex Buildpack we are using](https://github.com/Thermondo/heroku-buildpack-tex) allows a `texlive.packages` file in the root directory to specify additional packages to be installed.