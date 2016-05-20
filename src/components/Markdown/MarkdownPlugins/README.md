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

##Input Fields:
A list of objets. Each object corresponds to a parameter specified by the user, such as the size or color of the rendered plugin.
Each object should have:
-title: String, the name of the parameter as seen by users
-type: String, the name of the corresponding MarkdownPluginField. See MarkdownPluginFields/index.js for full list or to make a new field.
-params: [Optional] additional parameters specified by that plugin field

##React Component:
The React Component that you want to render with your plugin. The render function should return the html to be displayed. 

##EditorWidget
The representation of your plugin in the pub editor. The actual component will be rendered in the preview window.
