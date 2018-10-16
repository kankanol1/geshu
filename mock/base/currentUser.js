import moment from 'moment';

const userInfo = {
  userName: 'admin',
  role: 'admin',
  email: 'admin@gl-data.com',
  password: 'admin',
  createdAt: moment('2018-03-01 12:00:00', 'YYYY-MM-DD HH:mm:SS'),
  updatedAt: moment('2018-03-02 12:00:00', 'YYYY-MM-DD HH:mm:SS'),
  avatar: undefined,
};

export function getUserInfo(req, res) {
  return res.json(userInfo);
}

export function updatePassword(req, res) {
  const result = {
    success: true,
    message: '修改成功',
  };
  return res.json(result);
}

export default {
  // self manage.
  'GET /api/self/info': getUserInfo,
  'POST /api/self/password': updatePassword,
};