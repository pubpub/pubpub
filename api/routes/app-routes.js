const app = require('../api');

import {login} from './login-routes';
app.get('/loadAppAndLogin', login);
