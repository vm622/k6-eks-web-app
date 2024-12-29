import http from 'k6/http';
import { sleep, check } from 'k6';

export function rootFunction (url) {
    const res = http.get(url);
    check(res, {
        'status is 200': () => res.status === 200,
    });
}
