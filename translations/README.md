# Translations

The translations folder has two folders:

1. `languages/` - This folder contains .json files with all language translation strings. The en.json file is compiled from source while others are translated by humans.
2. `messages/` - This folder does not get git committed, but is is the output folder for babel-plugin-react-intl which crawls the source and compiles all instances of translated strings. These are the folders that are compiled to produce the en.json file in `languages/`.
