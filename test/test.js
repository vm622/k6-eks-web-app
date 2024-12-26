import {options } from './options.js'
import { sleep, check } from 'k6';
import http from 'k6/http';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export { options };

const url = 'http://web-service.default.svc.cluster.local:8080/';

export function rootRequest () {
  const res = http.get(url);
  check(res, {
      'status is 200': () => res.status === 200,
  });
  sleep(randomIntBetween(2, 6));
}
