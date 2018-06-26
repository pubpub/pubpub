/* eslint-disable */
/* Polyfill for Object.entries which prosemirror-compress requires */
/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries */

/* It's not clear why I wasn't using polyfill.io for this. Let's try that now instead */
if (!Object.entries)
	Object.entries = function(obj){
		var ownProps = Object.keys(obj),
			i = ownProps.length,
			resArray = new Array(i); // preallocate the Array
		while (i--)
			resArray[i] = [ownProps[i], obj[ownProps[i]]];
		
		return resArray;
	};
