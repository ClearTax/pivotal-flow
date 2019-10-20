import { shouldSkipBranchCheck } from './hooks';

it('should not skip when checking out a branch', () => {
  // git checkout bugfix/post-checkout-fails-when-checking_168659719
  expect(
    shouldSkipBranchCheck('61c0ee6200a3f9faeb1e9c24755861582384c1a0', '4c51aece308a74b4890ff67bbb2a0f75379ffd63', '1')
  ).toBeFalsy();
});

it('should skip when checking out a SHA', () => {
  // git checkout 8da0bfffc570e8f2ad01cf91dfe1b124994fa068
  expect(
    shouldSkipBranchCheck('8da0bfffc570e8f2ad01cf91dfe1b124994fa068', '8da0bfffc570e8f2ad01cf91dfe1b124994fa068', '1')
  ).toBeTruthy();
});

it('should skip when checking out a file', () => {
  // git checkout origin/master post-checkout.js
  expect(
    shouldSkipBranchCheck('472c1137ca2bc3da76f83fdd1b665e9ada4e8b1b', '472c1137ca2bc3da76f83fdd1b665e9ada4e8b1b', '1')
  ).toBeTruthy();
});
