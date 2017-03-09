const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === 'www.funky.com' || window.location.hostname === 'www.funkynocors.com';
const isRemoteDev = window.location.hostname === 'dev.pubpub.org' || window.location.hostname === 'test.epsx.org' || window.location.hostname === 'testnocors.epsx.org';
const isProd = !(isLocalDev || isRemoteDev);

exports.PUBPUB_EDITOR_URL = (isProd) ? 'https://editor.pubpub.org' : 'https://pubpub-editor-frontend.herokuapp.com';
exports.PUBPUB_CONVERSION_URL = 'https://pubpub-converter.herokuapp.com';
