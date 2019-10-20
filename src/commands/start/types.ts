export const enum StartStoryWorkflow {
  New,
  Owned,
  Unassigned,
}

export const enum StartStoryAction {
  CheckoutNewBranch = 'checkoutNewBranch',
  MoveToStartedState = 'moveToStartedState',
}
