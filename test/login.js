import http from 'k6/http';
import { sleep, check } from 'k6';

const userLoginData =  { username: "user1", password: "password1" }

export function loginFunction (url) {
    let res = http.post(url, JSON.stringify(userLoginData), {
        headers: { 'Content-Type': 'application/json' },
    });

    check(res, {
        'status is 200': () => res.status === 200,
    });
}
