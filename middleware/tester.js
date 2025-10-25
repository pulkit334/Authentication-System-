// save as load-test.js
const autocannon = require('autocannon');

const url = 'http://localhost:5000/od/getorder';

const instance = autocannon({
  url,
  connections: 5000, // start lower, increase gradually
  duration: 10
});

autocannon.track(instance, { renderProgressBar: true });

instance.on('done', (result) => {
  console.log('--- Test Complete ---');
  console.log('Requests/sec:', result.requests.average);
  console.log('Latency p50:', result.latency.p50);
  console.log('Latency p95:', result.latency.p95);
  console.log('Status codes:', result.statusCodes);
});
