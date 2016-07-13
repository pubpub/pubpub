/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
	*/
var loaderUtils = require("loader-utils");

module.exports = function() {};
module.exports.pitch = function(remainingRequest) {
	this.cacheable && this.cacheable();
	return `module.exports = function(cb) {
	  require.ensure([], function(require) {
	    cb(require(${loaderUtils.stringifyRequest(this, '!!' + remainingRequest)}));
	  });
	}`;
};