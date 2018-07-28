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
The [Latex Buildpack we are using](https://github.com/Thermondo/heroku-buildpack-tex) allows a `texlive.packages` file in the root directory to specify additional packages to be installed. [List of available packages](http://fedoraproject.org/wiki/Features/TeXLive) (I think... documentation on packages is a bit tough to find). [Can be useful](https://rpmfind.net/linux/rpm2html/search.php?query=texlive-collection-fontsextra) for understanding what's in collections. Not sure why it's so hard to find official documentation on texlive packages available.

# v5 Migration for Prod
- Add Cloudamqp to heroku deployment
- Update buildpacks on heroku
- Add workers dyno to heroku deployment
- Update database schemas (diff the models.js file)
- Remove local font loading from webpack.prod config. See comment TODO there.
- Change /chapters to /sections on firebase
- Update versionId in hydrateWrapper for analytics
- Add new config items to heroku
- Update firebase rules to not use localPermissions