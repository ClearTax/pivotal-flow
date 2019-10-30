import { shouldSkipBranchCheck } from './hooks';
import { inDetachedHeadState } from '../utils/git';

jest.mock('../utils/git', () => ({
  inDetachedHeadState: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

it('should not skip when checking out a branch', () => {
  // git checkout bugfix/post-checkout-fails-when-checking_168659719
  (inDetachedHeadState as jest.Mock).mockReturnValue(false);
  expect(
    shouldSkipBranchCheck('61c0ee6200a3f9faeb1e9c24755861582384c1a0', '4c51aece308a74b4890ff67bbb2a0f75379ffd63', '1')
  ).toBe(false);
  expect(inDetachedHeadState).toHaveBeenCalledTimes(1);
});

it('should skip when checking out a SHA', () => {
  // git checkout 8da0bfffc570e8f2ad01cf91dfe1b124994fa068
  (inDetachedHeadState as jest.Mock).mockReturnValue(true);
  expect(
    shouldSkipBranchCheck('8da0bfffc570e8f2ad01cf91dfe1b124994fa068', '8da0bfffc570e8f2ad01cf91dfe1b124994fa068', '1')
  ).toBeTruthy();
  expect(inDetachedHeadState).toHaveBeenCalledTimes(1);
});

it('should skip when checking out a file', () => {
  // git checkout origin/master post-checkout.js
  (inDetachedHeadState as jest.Mock).mockReturnValue(false);
  expect(
    shouldSkipBranchCheck('472c1137ca2bc3da76f83fdd1b665e9ada4e8b1b', '472c1137ca2bc3da76f83fdd1b665e9ada4e8b1b', '0')
  ).toBeTruthy();
  expect(inDetachedHeadState).not.toHaveBeenCalled();
});
