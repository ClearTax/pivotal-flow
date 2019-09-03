import test from 'ava';
import { suggestBranchName } from '../utils'

test('branch name from story name', t => {
  t.is(suggestBranchName({
    name: 'Add a new button to zoids',
  }), `add-a-new-button-to-zoids`);

  t.is(suggestBranchName({
    name: 'Build an end-to-end feature with the new application architecture',
  }), `build-an-end-to-end-feature`);

  t.is(suggestBranchName({
    name: 'New ITR Dashboard (no backend integration)',
  }), `new-itr-dashboard-no-backend`);

  t.is(suggestBranchName({
    name: '[P0][ITR-1] Validation Errors',
  }), `p0-itr-1-validation-errors`);

  t.is(suggestBranchName({
    name: 'Create schema and resolvers for summary table data in app',
  }), `create-schema-and-resolvers`);

  t.is(suggestBranchName({
    name: 'Fix Null Pointer Exception when computing tables for customers who have not filed recently.',
  }), `fix-null-pointer-exception`);

  t.is(suggestBranchName({
    name: `Fix TypeError: Cannot read property 'foo' of undefined`,
  }), `fix-type-error-cannot-read`);

  t.is(suggestBranchName({
    name: 'Add https://example.com in some page',
  }), `add-https-example-com-in-some`);

  t.is(suggestBranchName({
    name: 'Add XMLHttpRequest listener',
  }), `add-xml-http-request-listener`);

  t.is(suggestBranchName({
    name: 'Add listener for XMLHttpRequest',
  }), `add-listener-for-xml-http`);
});
