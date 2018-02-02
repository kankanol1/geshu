import fetch from 'dva/fetch';
import {message} from 'antd';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function errorFilter(response) {
  if (response.error !== undefined) {
    if (response.error) {
      const error = new Error(response.message);
      error.responseData = response;
      throw error;
    } else {
      return response.data;
    }
  }
  return response;
}

function globalErrorTip(err) {
  message.error(err.message);
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(errorFilter)
    .then(data => ({ data }))
    .catch(err => {
      globalErrorTip(err)
      return err
    });
}
