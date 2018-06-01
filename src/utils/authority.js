// get user info.
import fetch from 'dva/fetch';
import { message } from 'antd';
import store from '../index';
import { getUrlParams, replaceUrlWithParams } from './conversionUtils';

export function getAuthority() {
  return fetch('/api/self/info', {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  }).then((response) => {
    if (response.status !== 200) {
      const error = new Error(response.status);
      error.name = response.status;
      error.response = response;
      throw error;
    } else {
      return response.json();
    }
  }).then((response) => {
    if (response.role === 'admin') {
      return 'user';
    }
    return response.role;
  }).catch((e) => {
    if (e.name === 401) {
      message.info('请先登录');
    } else {
      message.info(`服务器错误，状态:${e.name}`);
    }
    const { pathname } = store.getState().routing.location;
    if (pathname === '/user/login') { return 'guest'; }
    // get location pathname
    const url = window.location.href;
    const urlParams = getUrlParams(url);
    // add the parameters in the url
    const redirectPath = replaceUrlWithParams('/#/user/login', { urlParams, redirect: pathname });
    window.history.replaceState(null, 'login', redirectPath);
    return 'guest';
  });
}

