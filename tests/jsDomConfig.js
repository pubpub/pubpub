require('testdom')('<html><body></body></html>');
global.XMLHttpRequest = window.XMLHttpRequest;
global.navigator = {userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'};
global.history = {};
console.debug = ()=>{};
