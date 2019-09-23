import test from 'ava';
import { suggestBranchName, shouldSkipBranchCheck } from '../utils';

test('branch name from story name', t => {
  t.is(
    suggestBranchName({
      name: 'Add a new button to zoids',
    }),
    `add-a-new-button-to-zoids`
  );

  t.is(
    suggestBranchName({
      name: 'Build an end-to-end feature with the new application architecture',
    }),
    `build-an-end-to-end-feature`
  );

  t.is(
    suggestBranchName({
      name: 'New ITR Dashboard (no backend integration)',
    }),
    `new-itr-dashboard-no-backend`
  );

  t.is(
    suggestBranchName({
      name: '[P0][ITR-1] Validation Errors',
    }),
    `p0-itr-1-validation-errors`
  );

  t.is(
    suggestBranchName({
      name: 'Create schema and resolvers for summary table data in app',
    }),
    `create-schema-and-resolvers`
  );

  t.is(
    suggestBranchName({
      name: 'Fix Null Pointer Exception when computing tables for customers who have not filed recently.',
    }),
    `fix-null-pointer-exception`
  );

  t.is(
    suggestBranchName({
      name: `Fix TypeError: Cannot read property 'foo' of undefined`,
    }),
    `fix-type-error-cannot-read`
  );

  t.is(
    suggestBranchName({
      name: 'Add https://example.com in some page',
    }),
    `add-https-example-com-in-some`
  );

  t.is(
    suggestBranchName({
      name: 'Add XMLHttpRequest listener',
    }),
    `add-xml-http-request-listener`
  );

  t.is(
    suggestBranchName({
      name: 'Add listener for XMLHttpRequest',
    }),
    `add-listener-for-xml-http`
  );
});

test('should not skip when checking out a branch', () => {
  // git checkout bugfix/post-checkout-fails-when-checking_168659719
  t.is(
    shouldSkipBranchCheck('61c0ee6200a3f9faeb1e9c24755861582384c1a0', '4c51aece308a74b4890ff67bbb2a0f75379ffd63', '1'),
    false
  );
});

test('should skip when checking out a SHA', () => {
  // git checkout 8da0bfffc570e8f2ad01cf91dfe1b124994fa068
  t.is(
    shouldSkipBranchCheck('8da0bfffc570e8f2ad01cf91dfe1b124994fa068', '8da0bfffc570e8f2ad01cf91dfe1b124994fa068', '1'),
    true
  );
});

test('should not skip when checking out a branch', () => {
  // git checkout origin/master post-checkout.js
  t.is(
    shouldSkipBranchCheck('472c1137ca2bc3da76f83fdd1b665e9ada4e8b1b', '472c1137ca2bc3da76f83fdd1b665e9ada4e8b1b', '1'),
    true
  );
});
