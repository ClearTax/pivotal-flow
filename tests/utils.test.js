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
    name: 'New GST Returns Dashboard (without API)',
  }), `new-gst-returns-dashboard`);

  t.is(suggestBranchName({
    name: '[P0][Anx-1] Validation Errors',
  }), `p0-anx-1-validation-errors`);

  t.is(suggestBranchName({
    name: 'Creating Schema and resolver for ITC Summary table data in Hydra',
  }), `creating-schema-and-resolver`);

  t.is(suggestBranchName({
    name: 'Null Pointer Exception when computing GSTR9 Tables for customers who have not filed GSTR1.',
  }), `null-pointer-exception-when`);

  t.is(suggestBranchName({
    name: 'Add https://example.com in some page',
  }), `add-https-example-com-in-some`);
});
