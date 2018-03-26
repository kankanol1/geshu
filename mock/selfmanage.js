import moment from 'moment';
import { getUrlParams } from './utils';

const userInfo = {
  userName: 'admin',
  role: 'admin',
  email: 'admin@gl-data.com',
  password: 'admin',
  createdAt: moment('2018-03-01 12:00:00', 'YYYY-MM-DD HH:mm:SS'),
  updatedAt: moment('2018-03-02 12:00:00', 'YYYY-MM-DD HH:mm:SS'),
  avatar: undefined,
};

export function getUserInfo(req, res, u, b) {
  if (res && res.json) {
    res.json(userInfo);
  } else {
    return userInfo;
  }
}

export function updatePassword(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { oldPassword, password } = body;

  const result = {
    success: true,
    message: '修改成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  updatePassword,
  getUserInfo,
};

