# Tests

Tests run using Mocha. All test files follow the pattern `filename.test.js`.

Tests can be run with `npm run test`. This will launch Mocha to watch all files and run tests on updates. Client code uses jsDOM to mock a DOM environment.

For best practices testing React and Redux components, see https://github.com/reactjs/redux/blob/master/docs/recipes/WritingTests.md


## Regarding Karma

We at one point used Karma to test the client code in real browsers. However, our experience so far has been that the errors that have caused issues have been ones that shallowRender (and thus Mocha tests) would catch. DOM-specific errors have not arisen, so let's see how far shallow rendering gets us, given that it is much simpler to write and faster to test. 

Easier test dev environment = less barrier to writing tests.

If we find ourselves swimming in browser bugs in the future, we can add Karma back to the testing stack.