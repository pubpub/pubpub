#How to make plugins:
##Format

Each Plugin must import PubPub.js which exposes a wrapper PubPub function that takes a:
  - reactComponent
  - config
  - inputFields
  - editorWidget

###Config:
An object that takes the following parameters:
- title: String, Of the plugin, used for all display purposes
- autocomplete: Boolean, determines whether the plugin shows up when the user autocompletes a popup
- color: the highlighting color of the widget
