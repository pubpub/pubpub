'use strict';

import markdown from 'markdown-it';
import React, { PropTypes, Component } from 'react';
import isPlainObject from 'lodash/lang/isPlainObject';
import assign from 'lodash/object/assign';
import reduce from 'lodash/collection/reduce';
import zipObject from 'lodash/array/zipObject';
import sortBy from 'lodash/collection/sortBy';
import compact from 'lodash/array/compact';
import camelCase from 'lodash/string/camelCase';
import isString from 'lodash/lang/isString';


const DEFAULT_TAGS = {
  'html': 'div'
};

const DEFAULT_RULES = {
  image(token, attrs, children) {
    if (children.length) {
      attrs = assign({}, attrs, { alt: children[0] });
    }
    return [[token.tag, attrs]];
  },

  codeInline(token, attrs) {
    return [compact([token.tag, attrs, token.content])];
  },

  codeBlock(token, attrs) {
    return [['pre', compact([token.tag, attrs, token.content])]];
  },

  fence(token, attrs) {
    if (token.info) {
      const langName = token.info.trim().split(/\s+/g)[0];
      attrs = assign({}, attrs, { 'data-language': langName });
    }

    return [['pre', compact([token.tag, attrs, token.content])]];
  },

  hardbreak() {
    return [['br']];
  },

  softbreak(token, attrs, children, options) {
    return options.breaks ? [['br']] : '\n';
  },

  text(token) {
    return token.content;
  },

  htmlBlock(token) {
    return token.content;
  },

  htmlInline(token) {
    return token.content;
  },

  inline(token, attrs, children) {
    return children;
  },
  mathBlock(token, attrs, children) {
    return [['math', compact([token.tag, attrs, token.content])]];
  },
  mathInline(token, attrs, children) {
    return [['math', compact([token.tag, attrs, token.content])]];
  },
  default(token, attrs, children, options, getNext) {
    if (token.nesting === 1 && token.hidden) {
      return getNext();
    }
    /* plugin-related */
    if (!token.tag) {
      return token.content;
    }
    if (token.info) {
      attrs = assign({}, attrs, { 'data-info': token.info.trim() });
    }
    /* plugin-related */
    return [compact([token.tag, attrs].concat((token.nesting === 1) && getNext()))];
  }
};

function convertTree(tokens, convertRules, options) {
  function convertBranch(tkns, nested) {
    let branch = [];

    if (!nested) {
      branch.push('html');
    }

    function getNext() {
      return convertBranch(tkns, true);
    }

    let token = tkns.shift();
    while (token && token.nesting !== -1) {
      const attrs = token.attrs && zipObject(sortBy(token.attrs, 0));
      const children = token.children && convertBranch(token.children.slice(), true);
      const rule = convertRules[camelCase(token.type)] || convertRules.default;

      branch = branch.concat(
        rule(token, attrs, children, options, getNext)
      );
      token = tkns.shift();
    }
    return branch;
  }

  return convertBranch(tokens, false);
}

function mdReactFactory(options={}) {
  const { onIterate, tags=DEFAULT_TAGS,
    presetName, markdownOptions,
    enableRules=[], disableRules=[], plugins=[],
    onGenerateKey=(tag, index) => `mdrct-${tag}-${index}`,
    className } = options;

  let md = markdown(markdownOptions || presetName)
    .enable(enableRules)
    .disable(disableRules);

  const convertRules = assign({}, DEFAULT_RULES, options.convertRules);

  md = reduce(plugins, (m, plugin) =>
    plugin.plugin ?
    m.use(plugin.plugin, ...plugin.args) :
    m.use(plugin),
    md
  );

  function iterateTree(tree, level=0, index=0) {
    let tag = tree.shift();
    const key = onGenerateKey(tag, index);

    const props = (tree.length && isPlainObject(tree[0])) ?
      assign(tree.shift(), { key }) :
      { key };

    if (level === 0 && className) {
      props.className = className;
    }

    const children = tree.map(
      (branch, idx) => Array.isArray(branch) ?
        iterateTree(branch, level + 1, idx) :
        branch
    );

    tag = tags[tag] || tag;

    if (isString(props.style)) {
      props.style = zipObject(
        props.style.split(';')
          .map(prop => prop.split(':'))
          .map(keyVal => [camelCase(keyVal[0].trim()), keyVal[1].trim()])
      );
    }

    return (typeof onIterate === 'function') ?
      onIterate(tag, props, children, level) :
      React.createElement(tag, props, children);
  }

  return function(text) {
    const tree = convertTree(md.parse(text, {}), convertRules, md.options);
    return iterateTree(tree);
  };
}

class MDReactComponent extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    onIterate: PropTypes.func,
    onGenerateKey: PropTypes.func,
    tags: PropTypes.object,
    presetName: PropTypes.string,
    markdownOptions: PropTypes.object,
    enableRules: PropTypes.array,
    disableRules: PropTypes.array,
    convertRules: PropTypes.object,
    plugins: PropTypes.array,
    className: PropTypes.string
  };
  constructor(props) {
    super(props);
    const { text, ...newProps } = this.props;
    this.mdfactory = mdReactFactory(newProps);
  }
  render() {
    const { text, ...newProps } = this.props;
    if (this.mdfactory) {
      return this.mdfactory(text);
    } else {
      return <span></span>;
    }
  }
}

export default MDReactComponent;
export { mdReactFactory as mdReact };
