import moment from 'moment';

const userInfo = {
  userName: 'admin',
  role: 1,
  roleName: '超级管理员',
  privileges: [
    1,
    2,
    3,
    4,
    17,
    18,
    19,
    20,
    33,
    34,
    35,
    36,
    49,
    257,
    258,
    259,
    260,
    273,
    274,
    275,
    276,
  ],
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
