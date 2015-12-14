// Taken from https://github.com/FormidableLabs/css-to-radium
// Edited to work for Radium Style elements.
// Specifically, we don't remove 'px' from item values.

var _ = require('lodash');
var postcss = require('postcss');
var camelCase = require('camelcase');

var sanitizeSelector = function (selector) {
  return selector.replace(/\n/gi, ' ');
};

var convertValue = function (value) {
  var result = value;
  var resultNumber = Number(result);

  // // Handle single pixel values (font-size: 16px)
  // if (result.indexOf(' ') === -1 && result.indexOf('pxx') !== -1) {
  //   result = parseInt(result.replace('px', ''), 10);
  // // Handle numeric values
  // } else 

  if (_.isNaN(resultNumber) === false) {
    result = resultNumber;
  }

  return result;
};

var convertProp = function (prop) {
  var result = camelCase(prop);

  // Handle vendor prefixes
  if (prop.indexOf('-webkit') === 0) {
    result = result.replace('webkit', 'Webkit');
  } else if (prop.indexOf('-moz') === 0) {
    result = result.replace('moz', 'Moz');
  } else if (prop.indexOf('-o') === 0) {
    result = result.replace('o', 'O');
  }

  return result;
};

var convertDecl = function (decl) {
  return {
    property: convertProp(decl.prop),
    value: convertValue(decl.value)
  };
};

var convertRule = function (rule) {
  var returnObj = {};
  var selector = sanitizeSelector(rule.selector);

  returnObj[selector] = _.transform(rule.nodes, function (convertedDecls, decl) {
    if (decl.type === 'decl') {
      var convertedDecl = convertDecl(decl);

      convertedDecls[convertedDecl.property] = convertedDecl.value;
    }
  }, {})

  return returnObj;
};

var convertMedia = function (media) {
  var returnObj = { mediaQueries: {} };
  returnObj.mediaQueries[media.params] = {};

  _.forEach(media.nodes, function (node) {
    if (node.type !== 'rule') {
      return;
    }

    _.merge(returnObj.mediaQueries[media.params], convertRule(node));
  });

  return returnObj;
};

var convertCss = function (sourceCss) {
  var source = postcss.parse(sourceCss).nodes;

  return _.transform(source, function (convertedObj, node) {
    node.type === 'rule' && _.merge(convertedObj, convertRule(node));
    node.name === 'media' && _.merge(convertedObj, convertMedia(node));
  }, {});
};

module.exports = convertCss;
