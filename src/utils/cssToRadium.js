// Taken from https://github.com/FormidableLabs/css-to-radium
// Edited to work for Radium Style elements.
// Specifically, we don't remove 'px' from item values.
// Edited to not use lodash.

var postcss = require('postcss');
var camelCase = require('camelcase');

var sanitizeSelector = function (selector) {
  return selector.replace(/\n/gi, ' ');
};

var merge = function(target, src) {
  var array = Array.isArray(src);
  var dst = array && [] || {};

  if (array) {
      target = target || [];
      dst = dst.concat(target);
      src.forEach(function(e, i) {
          if (typeof dst[i] === 'undefined') {
              dst[i] = e;
          } else if (typeof e === 'object') {
              dst[i] = merge(target[i], e);
          } else {
              if (target.indexOf(e) === -1) {
                  dst.push(e);
              }
          }
      });
  } else {
      if (target && typeof target === 'object') {
          Object.keys(target).forEach(function (key) {
              dst[key] = target[key];
          })
      }
      Object.keys(src).forEach(function (key) {
          if (typeof src[key] !== 'object' || !src[key]) {
              dst[key] = src[key];
          }
          else {
              if (!target[key]) {
                  dst[key] = src[key];
              } else {
                  dst[key] = merge(target[key], src[key]);
              }
          }
      });
  }

  return dst;
};

var convertValue = function (value) {
  var result = value;
  var resultNumber = Number(result);

  // // Handle single pixel values (font-size: 16px)
  // if (result.indexOf(' ') === -1 && result.indexOf('pxx') !== -1) {
  //   result = parseInt(result.replace('px', ''), 10);
  // // Handle numeric values
  // } else 

  if (isNaN(resultNumber) === false && resultNumber !== undefined) {
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

  const convertedDecls = {};
  for (const key in rule.nodes) {
    const decl = rule.nodes[key];
    if (decl.type === 'decl') {
      var convertedDecl = convertDecl(decl);

      convertedDecls[convertedDecl.property] = convertedDecl.value;
    }
  }
  returnObj[selector] = convertedDecls;

  return returnObj;
};

var convertMedia = function (media) {
  var returnObj = { mediaQueries: {} };
  returnObj.mediaQueries[media.params] = {};

  media.nodes.forEach(function (node) {
    if (node.type !== 'rule') {
      return;
    }
    returnObj.mediaQueries[media.params] = merge(returnObj.mediaQueries[media.params], convertRule(node));
  });
  return returnObj;
};

var convertCss = function (sourceCss) {
  var source = postcss.parse(sourceCss).nodes;

  var convertedObj = {};
  for (const key in source) {
    const node = source[key];
    convertedObj = node.type === 'rule' ? merge(convertedObj, convertRule(node)) : convertedObj;
    convertedObj = node.name === 'media' ? merge(convertedObj, convertMedia(node)) : convertedObj;
  }
  return convertedObj;
};

module.exports = convertCss;
