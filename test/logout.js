import http from 'k6/http';
import { sleep, check } from 'k6';

export function logoutFunction (url) {
    let res = http.post(url, JSON.stringify({}), {
        headers: { 'Content-Type': 'application/json' },
        jar: http.cookieJar()
    });
    

    check(res, {
        'status is 200': () => res.status === 200,
    });
}
