import * as fs from 'fs';
import {sync as globSync} from 'glob';
import {sync as mkdirpSync} from 'mkdirp';

// I'm not sure why babel-plugin-react-intl is putting everything into a nested
// tree under messages/node_modules. I can't seem to fix it. maybe in babel6 it'll be better?
const MESSAGES_PATTERN = './translations/messages/src/**/*.json';
const TRANSLATIONS_DIR = './translations/';
const LANG_DIR         = './translations/languages/';
const LANG_PATTERN     = './translations/languages/*.json';


const findMissingStrings = function() {
    let englishJSON = {};
    let languageJSONs = [];
    let languages = [];
    globSync(LANG_PATTERN).map((filename) => {
        const file = fs.readFileSync(filename, 'utf8');
        if (filename.indexOf('en.json') > -1) {
            englishJSON = JSON.parse(file);
        } else {
            languages.push(filename.substring(filename.length - 7, filename.length - 5));
            languageJSONs.push( JSON.parse(file) );
        }
    });

    const outputJSON = {};

    for (let index = languageJSONs.length; index--;) {
        outputJSON[languages[index]] = {};
        for (const englishKey in englishJSON) {
            if (englishKey in languageJSONs[index] === false) {
                outputJSON[languages[index]][englishKey] = 'Missing. English is: ' + englishJSON[englishKey];
            } else if (englishJSON[englishKey] === languageJSONs[index][englishKey]) {
                outputJSON[languages[index]][englishKey] = 'Same as English: ' + englishJSON[englishKey];
            }
        }
    }

    // console.log(JSON.stringify(outputJSON, null, 2));
    fs.writeFileSync(TRANSLATIONS_DIR + 'missing.json', JSON.stringify(outputJSON, null, 2));

}

// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.
const compileTranslations = function() {
	let defaultMessages = globSync(MESSAGES_PATTERN)
    .map((filename) => fs.readFileSync(filename, 'utf8'))
    .map((file) => JSON.parse(file))
    .reduce((collection, descriptors) => {
        descriptors.forEach(({id, defaultMessage}) => {
            if (collection.hasOwnProperty(id)) {
                // throw new Error(`Duplicate message id: ${id}`);
                // console.log('Warning: Duplicate message id:', id);
            }

            collection[id] = defaultMessage;
        });

        return collection;
    }, {});

	mkdirpSync(LANG_DIR);
	fs.writeFileSync(LANG_DIR + 'en.json', JSON.stringify(defaultMessages, null, 2));
    findMissingStrings();
};



module.exports = compileTranslations;
