require('babel-core/register');
import sys from 'sys';
import {exec} from 'child_process';
import {FirebaseSecret} from '../authentication/firebaseCredentials';


export function backupFirebase({prod, cb}) {

  const baseURL =  (!prod) ? `https://pubpub-dev.firebaseio.com` : `https://pubpub.firebaseio.com`;
  const urlString = `${baseURL}//.json?print=pretty&auth=${FirebaseSecret}`;

  function puts(error, stdout, stderr) {
    sys.puts(stdout)
    cb();
  }
  exec(`curl "${urlString}" > firebaseDev.json`, puts);

}
