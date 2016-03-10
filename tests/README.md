# Tests

Tests run using Mocha and Karma. All test files follow the pattern `filename.test.js`.

Tests can be run with `npm run test`. This will launch Mocha to watch all files and run tests on updates. This will test server and client code. Client code uses jsDOM to mock a DOM environment. 

Karma is used to test the client code in real browsers. It is run with 'npm run test-karma'. These tests provide important real-world testing (in real browsers rather than a jsDOM), but are slower to run and update. 

For faster debugging, `npm run test` will serve the majority of the job while `npm run test-karma` provides slower, but more truthful tests. 

`npm run test` tests both *client* and *server* test code
`npm run test-karma` tests only *client* test code



Local API tests start an instance of mongodb to confirm database behavior.

For best practices testing React and Redux components, see https://github.com/reactjs/redux/blob/master/docs/recipes/WritingTests.md
