import moment from 'moment';
import { getUrlParams } from './utils';

/**
 * user related mock.
 */

let userListDataSource = [
  {
    userName: 'user',
    role: 'user',
    email: 'user@gl-data.com',
    password: 'user',
    createdAt: moment('2018-03-01 12:01:00', 'YYYY-MM-DD HH:mm:SS'),
    updatedAt: moment('2018-03-02 12:01:00', 'YYYY-MM-DD HH:mm:SS'),
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  },
  {
    userName: 'admin',
    role: 'admin',
    email: 'admin@gl-data.com',
    password: 'admin',
    createdAt: moment('2018-03-01 12:00:00', 'YYYY-MM-DD HH:mm:SS'),
    updatedAt: moment('2018-03-02 12:00:00', 'YYYY-MM-DD HH:mm:SS'),
    avatar: undefined,
  },
];

export function login(req, res, u) {
  const { password, userName } = req.body;
  const users = userListDataSource.filter(item =>
    item.userName === userName && item.password === password);
  const user = users.length === 1 ? users[0] : undefined;
  if (user) {
    res.send({
      status: 'ok',
      currentAuthority: user.role,
      userName: user.userName,
      avatar: user.avatar,
      email: user.email,
    });
  } else {
    res.send({
      status: 'error',
      currentAuthority: 'guest',
    });
  }
}

export function createUser(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { userName, role, email, password, avatar } = body;

  userListDataSource.unshift({
    userName,
    role,
    email,
    password,
    createdAt: moment(),
    updatedAt: moment(),
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  });

  const result = {
    success: true,
    message: '添加成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function userList(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...userListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.userName) {
    dataSource = dataSource.filter(data => data.userName.indexOf(params.userName) >= 0);
  }

  if (params.email) {
    dataSource = dataSource.filter(data => data.email.indexOf(params.email) >= 0);
  }

  if (params.role) {
    dataSource = dataSource.filter(data => data.role === params.role);
  }

  if (params.updatedAt) {
    const updatedAt = params.updatedAt.split(',').map(t => moment(t, 'YYYYMMDD'));
    dataSource = dataSource.filter((data) => {
      if (data.updatedAt >= updatedAt[0] && data.updatedAt <= updatedAt[0]) {
        return true;
      }
      return false;
    });
  }

  if (params.createdAt) {
    const createdAt = params.createdAt.split(',').map(t => moment(t, 'YYYYMMDD'));
    dataSource = dataSource.filter((data) => {
      if (data.createdAt >= createdAt[0] && data.createdAt <= createdAt[0]) {
        return true;
      }
      return false;
    });
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  let currentPage = 1;
  if (params.currentPage) {
    currentPage = params.currentPage; // eslint-disable-line
  }

  const startNum = (currentPage - 1) * pageSize;
  const returnDataSource = dataSource.slice(startNum, startNum + pageSize);

  const formatedDataSource = returnDataSource.map((item) => {
    return {
      ...item,
      createdAt: item.createdAt.format('YYYY-MM-DD HH:mm'),
      updatedAt: item.updatedAt.format('YYYY-MM-DD HH:mm'),
    };
  });

  const result = {
    list: formatedDataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function deleteUser(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { userNames } = body;

  userListDataSource = userListDataSource.filter(item => !userNames.includes(item.userName));

  const result = {
    success: true,
    message: '删除成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function queryUserName(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  const successError = {
    success: true,
    message: '',
  };

  const failedError = {
    success: false,
    message: '已有相同用户名',
  };

  let returnJson = successError;
  if (params.userName) {
    const filteredUser = userListDataSource.filter(item => item.userName === params.userName);
    if (filteredUser.length !== 0) {
      returnJson = failedError;
    } else {
      returnJson = successError;
    }
  } else {
    returnJson = failedError;
  }

  if (res && res.json) {
    res.json(returnJson);
  } else {
    return returnJson;
  }
}

// export function modifyPassword(req, res, u) {
//   /** default modify admin's password. */

// }

export default {
  login,
  userList,
  createUser,
  deleteUser,
};
