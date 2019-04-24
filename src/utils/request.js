import { notification, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import fetch from 'dva/fetch';
import Cookie from 'js-cookie';
import { getFromRegistory } from '../common/registry';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

let notifications = [];

let checking = false;

function showNotification({ message, description, code }) {
  if (notifications.filter(i => code === i.code).length === 0) {
    // add to notification
    notifications.push({ message, description });
  }
  if (!checking) {
    displayNextNotification();
    setTimeout(displayNextNotification, 2000);
    checking = true;
  }
}

const displayNextNotification = () => {
  const nt = notifications[0];
  if (nt) {
    notifications = notifications.filter((x, i) => i !== 0);
    notification.error({
      message: nt.message,
      description: nt.description,
      duration: 2,
    });
    if (notifications.length > 0) {
      // check
      setTimeout(displayNextNotification, 2000);
    } else {
      checking = false;
    }
  }
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  showNotification({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
    code: response.status,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

export function wrapOptions(options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
        'X-XSRF-TOKEN': Cookie.get('XSRF-TOKEN'),
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        'X-XSRF-TOKEN': Cookie.get('XSRF-TOKEN'),
        ...newOptions.headers,
      };
    }
  }
  return newOptions;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options = {}) {
  const { isText, ...restOps } = options;
  const newOptions = wrapOptions(restOps);
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return isText ? response.text() : response.json();
    })
    .catch(e => {
      const store = getFromRegistory('store');
      const { dispatch } = store;
      const status = e.name;
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status === 401) {
        let json = {};
        try {
          json = e.response.json();
        } catch (err) {
          console.error('error while parsing: ', json); // eslint-disable-line
        }
        Modal.error({
          title: '请重新登录',
          content: `${json.message || '登录过期，请重新登录'}`,
          okText: '确定',
          onOk: () => {
            dispatch({
              type: 'login/logout',
            });
          },
        });
        return;
      }
      if (status <= 504 && status >= 500) {
        // dispatch(routerRedux.push('/exception/500'));
        Modal.error({
          title: '服务器错误!',
          content: `服务器错误(错误码:${status})，请重试。若此错误频繁出现，请联系管理人员`,
          okText: '确定',
          onOk: () => window.location.reload(),
        });
        return;
      }
      if (status >= 404 && status < 422 && !url.startsWith('/api')) {
        dispatch(routerRedux.push('/exception/404'));
      }
    });
}
