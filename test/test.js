import {options } from './options.js'
import { sleep, check } from 'k6';
import http from 'k6/http';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { rootFunction } from './root.js';
import { loginFunction } from './login.js';
import { logoutFunction } from './logout.js';

export { options };

const url = 'http://web-service.default.svc.cluster.local:8080/';

export default function() {
  rootFunction(url);
  sleep(randomIntBetween(4, 6));

  loginFunction(url.concat("login"));
  sleep(randomIntBetween(3, 10));

  logoutFunction(url.concat("logout"));
  sleep(randomIntBetween(1, 2));
}
