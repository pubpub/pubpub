Howdy! Thanks for the interest in contributing to PubPub!

## Development

To get started developing, you will need to configure your /api/config.js file (see [/api/config.sample.js](/api/config.sample.js) run and to install dependencies:
```
npm install
npm run dev
```

### Testing

Tests should be written and created alongside the files they are testing. In some cases, we opt for a `_tests_` folder to preserve the cleanliness of the file structure.

New features and functionality should be accompanied by associated tests validating the functionality of those features. See [./src/tests](./src/tests) for more.


### Linting

Before committing any changes, be sure to run `npm run lint`. This will lint all relevant files using [ESLint](http://eslint.org/) and report on any changes that you need to make.
