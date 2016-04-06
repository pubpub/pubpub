export function editorDefaultPubText(title, author) {
	return `-----
title: ` + title + `

author: ` + author.username + `
	name: ` + author.name + `

abstract: Type your abstract here! Your abstract will be used to help users search for pubs throughout the site.

authorsNote: Use the authorsNote to mark if a pub is a draft in-progress or any other pertinent details you think your readers should know - or remove it all together.

-----

# Welcome to your new Pub!
PubPub documents let you separate the style from the writing. Click live-preview in the top-right corner to view your rendered document.

Formatting actions like **bold** or *italic* can be found on the right, while a dynamic Table of Contents is on the left. Click different sections in the Table of Contents to focus on a specific section.

# You can focus on sections!

Rich media and content can be uploaded using the assets popup (top-left). Using plugins like [[image]] or [[video]] to add your assets into your pub. Available plugins can be found on the right-hand formatting bar.

Markdown has great support for lists

1. First
2. Second
3. Third

Things like editor font, editor font-size and other options can be found in the settings pane (top-right).

Feel free to contact us at pubpub@media.mit.edu with any questions.
`;
}

export function editorDefaultPageText(journalName) {
	return `-----
header:
	journalName: ` + journalName + `
    description: Describe your journal - what's your tagline?
    searchBox: [[{"pluginType":"search","fontColor":null,"bottomLineColor":null,"placeholderText":null,"placeholderColor":null}]]
-----


::: section
# Featured Pubs
[[{"pluginType":"pubList"}]]
:::

::: section
# About this Journal
Write descriptive text here
:::

-----
footer:
	footeritem: [[{"pluginType":"link","source":null,"text":"Great Link","url":"/pub/about"}]]
    footeritem: [[{"pluginType":"link","source":null,"text":"Fantastic Link","url":"/pub/about"}]]
    footeritem: [[{"pluginType":"link","source":null,"text":"Astonishing Link","url":"/pub/about"}]]
-----`;
}
