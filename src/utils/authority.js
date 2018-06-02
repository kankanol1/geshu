
import store from '../index';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  if (store) {
    return store.getState().global.role;
  } else {
    return 'guest';
  }
}

export function setAuthority(authority) {
  return localStorage.setItem('projectx-authority', authority);
}
