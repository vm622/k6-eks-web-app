export const options = {
    scenarios: {
        smokeTest: {
            executor: 'constant-vus',
            vus: 800,
            duration: '5m',
            tags: { test_type: 'smoke'},
            gracefulStop: '5s'
        },
        loadTest: {
            executor: 'ramping-vus',
            stages: [
                { duration: '30s', target: 1200 },
                { duration: '6m', target: 1200 },
                { duration: '30s', target: 0 },
            ],
            startTime: '10m',
            tags: { test_type: 'load'},
        },
        stressTest: {
            executor: 'ramping-vus',
            stages: [
                { duration: '1m', target: 800 }, 
                { duration: '5m', target: 800 }, 
                { duration: '1m', target: 1300 }, 
                { duration: '5m', target: 1300 }, 
                { duration: '1m', target: 1900 }, 
                { duration: '5m', target: 1900 }, 
                { duration: '5m', target: 0 },
            ],
            startTime: '22m',
            tags: { test_type: 'stress'},
        },
        spikeTest: {
            executor: 'ramping-vus',
            stages: [
                { duration: '30s', target: 4000 }, 
                { duration: '5m', target: 4000 }, 
                { duration: '3s', target: 0 }, 
            ],
            startTime: '35m',
            tags: { test_type: 'spike'},
        },
        breakpointTest: {
            executor: 'ramping-vus',
            stages: [
                { duration: '30m', target: 6000 }, 
                { duration: '3m', target: 0 }, 
            ],
            startTime: '45m',
            tags: { test_type: 'breakpoint'},
        },
        soakTest: {
            executor: 'ramping-vus',
            stages: [
                { duration: '5m', target: 800 }, 
                { duration: '1h', target: 800 },
                { duration: '5m', target: 0 }, 
            ],
            startTime: '80m',
            tags: { test_type: 'soak'},
        }
    },
    thresholds: {
        'http_req_duration{test_type:smoke}': [
            {
                "threshold": 'avg<500',
                "abortOnFail": false
            }
        ],
        'http_req_duration{test_type:load}': [
            {
                "threshold": 'p(90)<500',
                "abortOnFail": false
            }
        ],
        'http_req_duration{test_type:stress}': [
            {
                "threshold": 'p(90)<600',
                "abortOnFail": false
            }
        ],
        'http_req_duration{test_type:spike}': [
            {
                "threshold": 'avg<700',
                "abortOnFail": false
            }
        ],
        'http_req_duration{test_type:breakpoint}': [
            {
                "threshold": 'avg<750',
                "abortOnFail": false
            }
        ],
        'http_req_duration{test_type:soak}': [
            {
                "threshold": 'p(95)<450',
                "abortOnFail": false
            }
        ]
        
    },
};
