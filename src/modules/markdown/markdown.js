var React = require('react');
var marked = require('./marked');
var ent = require('ent');
var renderer = new marked.Renderer();
var options = {};
var inlineIds = 0;
var keys = 0;
var inlines = {};
var result = [];
var toc = [];
var travisTOC = [];
var travisTOCFull = [];

// Converts inline IDs to actual elements
var createBlockContent = function (content) {

  var textWithInlines = content.split(/(\{\{.*?\}\})/);
  content = textWithInlines.map(function (text) {
    var inline = text.match(/\{\{(.*)\}\}/);
    if (inline) {
      return inlines[inline[1]];
    } else {
      return ent.decode(text);
    }
  });
  return content;
};

var getTocPosition = function (toc, level) {
  var currentLevel = toc.children;
  while (true) {
    if (!currentLevel.length || currentLevel[currentLevel.length - 1].level === level) {
      return currentLevel;
    } else {
      currentLevel = currentLevel[currentLevel.length - 1].children;
    }
  }
};

renderer.code = function (code, language) {
  result.push(CodeComponent({key: keys++, language: language, code: code}));
};

renderer.blockquote = function (text) {
  result.pop();
  result.push(React.createElement(options.blockquote || 'blockquote', null,
    React.createElement('p', {key: keys++}, createBlockContent(text))
  ));
};

// How does this happen?
renderer.html = function (html) {
  return html;
};

renderer.heading = function (text, level) {
  var type = 'h' + level;
  type = options[type] || type;
  var id = text.replace(/\s/g, '-').toLowerCase();
  var lastToc = toc[toc.length -1];

  if (level) {
    travisTOCFull.push({
        id: id,
        title: text,
        level: level,
      });
  }

  if (level === 1) {
    travisTOC.push({
      id: id,
      title: text,
      level: level,
    });
  }

  if (!lastToc || lastToc.level > level) {
    toc.push({
      id: id,
      title: text,
      level: level,
      children: []
    });
  } else {
    var tocPosition = getTocPosition(lastToc, level);
    tocPosition.push({
      id: id,
      title: text,
      level: level,
      children: []
    });
  }
  result.push(React.createElement(type, {
    key: keys++,
    id: id
  },
    createBlockContent(text)));
};

renderer.hr = function () {
  result.push(React.createElement(options.hr || 'hr', {key: keys++}));
};

renderer.list = function (body, ordered) {
  result.push(React.createElement(ordered ? options.ol || 'ol' : options.ul || 'ul', {key: keys++}, createBlockContent(body)));
};

renderer.listitem = function (text) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.li || 'li', {key: keys++}, createBlockContent(text));
  return '{{' + id + '}}';
};

renderer.paragraph = function (text) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.p || 'p', {key: keys++}, createBlockContent(text));
  result.push(inlines[id]);
  return '{{' + id + '}}';
};

renderer.table = function (header, body) {
  result.push(React.createElement(options.table || 'table', {key: keys++},
    createBlockContent(header),
    createBlockContent(body)
  ));
};

renderer.tablerow = function (content) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.tr || 'tr', {key: keys++}, createBlockContent(content));
  return '{{' + id + '}}';
};

renderer.tablecell = function (content, flags) {
  var id = inlineIds++;
  var props =  flags.align ? {className: 'text-' + flags.align} : {key: keys++};
  inlines[id] = React.createElement(flags.header ? options.th || 'th' : options.td || 'td', props, createBlockContent(content));
  return '{{' + id + '}}';
};

renderer.link = function (href, title, text) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.a || 'a', {
    href: href,
    title: title,
    key: keys++,
    target: 'new'
  }, ent.decode(text));
  return '{{' + id + '}}';
};

renderer.strong = function (text) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.strong || 'strong', {key: keys++}, ent.decode(text));
  return '{{' + id + '}}';
};

renderer.em = function (text) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.em || 'em', {key: keys++}, ent.decode(text));
  return '{{' + id + '}}';
};

renderer.codespan = function (text) {
  var id = inlineIds++;
  inlines[id] = React.createElement('code', {key: keys++}, ent.decode(text));
  return '{{' + id + '}}';
};

renderer.br = function (text) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.br || 'br', {key: keys++}, ent.decode(text));
  return '{{' + id + '}}';
};

renderer.del = function (text) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.del || 'del', {key: keys++}, ent.decode(text));
  return '{{' + id + '}}';
};

renderer.image = function (href, title, text) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.img || 'img', {src: href, alt: title, key: keys++});
  return '{{' + id + '}}';
};

var exec = function (content,assets) {
  result = [];
  toc = [];
  travisTOC = [];
  travisTOCFull = [];
  inlines = {};
  keys = 0;
	//options = {};
	renderer.assets = assets;
  marked(content, {renderer: renderer, smartypants: true});
  return {
    tree: result,
    toc: toc,
    travisTOC: travisTOC,
    travisTOCFull: travisTOCFull,
  };
};

exec.setExtensions = function (extensions) {

	var newOptions = {};

	var blockRenderer = function(elem,text,props) {
		if (!props){
			props = {};
		}
		props['key'] = keys++;
		result.push(React.createElement(options[elem] || elem, props,ent.decode(text)));
	  return;
	};

	var inlineRenderer = function(elem,text,props) {
		var id = inlineIds++;
		if (!props){
			props = {};
		}
		props['key'] = keys++;
		inlines[id] = React.createElement(options[elem] || elem,props, ent.decode(text));
		return '{{' + id + '}}';
	};

	for (var ext in extensions){
		if (extensions[ext].inline == true) {
			extensions[ext].renderer = inlineRenderer.bind(this,ext);
		} else {
			extensions[ext].renderer = blockRenderer.bind(this,ext);
		}
		renderer[ext] = extensions[ext].renderer;
		options[ext] = extensions[ext].component;
	}
	renderer.extensions = extensions;
}.bind(this);

exec.configure = function (newOptions) {
  //options = newOptions;
};

module.exports = exec;
