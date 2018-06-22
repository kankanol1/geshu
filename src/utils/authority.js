// use localStorage to store the authority info, which might be sent from server in actual project.
import store from '../index';

export function getAuthority() {
  if (store && store.getState().global.currentUser.role !== undefined) {
    return store.getState().global.currentUser.role;
  } else {
    return localStorage.getItem('projectx-authority') || 'guest';
  }
}

export function setAuthority(authority) {
  return localStorage.setItem('projectx-authority', authority);
}
