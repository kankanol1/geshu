import { getFromRegistory } from '../common/registry';

// use localStorage to store the authority info, which might be sent from server in actual project.

const store = getFromRegistory('store');

export function getAuthority() {
  let v = [];
  if (store && store.getState().global.currentUser !== undefined) {
    v = store.getState().global.currentUser.currentAuthority;
  }
  return v;
}
