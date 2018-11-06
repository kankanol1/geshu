import moment from 'moment';
import { getUrlParams } from '../utils';

/**
 * user related mock.
 */

let userListDataSource = [
  {
    userName: 'user',
    role: 4,
    roleName: '数据处理人员',
    privileges: [257, 258, 259, 260, 273, 274, 275, 276],
    email: 'user@gl-data.com',
    password: 'user',
    createdAt: moment('2018-03-01 12:01:00', 'YYYY-MM-DD HH:mm:SS'),
    updatedAt: moment('2018-03-02 12:01:00', 'YYYY-MM-DD HH:mm:SS'),
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  },
  {
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
  },
];

export function login(req, res) {
  const { password, userName } = req.body;
  const users = userListDataSource.filter(
    item => item.userName === userName && item.password === password
  );
  const user = users.length === 1 ? users[0] : undefined;
  if (user) {
    return res.send({
      status: 'ok',
      currentAuthority: user.privileges,
      userName: user.userName,
      avatar: user.avatar,
      email: user.email,
    });
  } else {
    return res.send({
      status: 'error',
      currentAuthority: [],
    });
  }
}

export function createUser(req, res) {
  const { body } = req;
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

  return res.json(result);
}

export function userList(req, res) {
  const { url } = req;
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
    dataSource = dataSource.filter(data => {
      if (data.updatedAt >= updatedAt[0] && data.updatedAt <= updatedAt[0]) {
        return true;
      }
      return false;
    });
  }

  if (params.createdAt) {
    const createdAt = params.createdAt.split(',').map(t => moment(t, 'YYYYMMDD'));
    dataSource = dataSource.filter(data => {
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

  const formatedDataSource = returnDataSource.map(item => {
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
  return res.json(result);
}

export function deleteUser(req, res) {
  const { body } = req;
  const { userNames } = body;

  userListDataSource = userListDataSource.filter(item => !userNames.includes(item.userName));

  const result = {
    success: true,
    message: '删除成功',
  };
  return res.json(result);
}

export function queryUserName(req, res) {
  const { url } = req;
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

  return res.json(returnJson);
}

export function updateUser(req, res, u, b) {
  const { body } = req;
  const { userName, role, email, password, avatar } = body;

  userListDataSource = userListDataSource.map(item => {
    if (item.userName === userName) {
      return { ...item, role, email, password, avatar };
    } else {
      return item;
    }
  });
  const result = {
    success: true,
    message: '修改成功',
  };

  return res.json(result);
}

// export function modifyPassword(req, res, u) {
//   /** default modify admin's password. */

// }

export function fetchRoles(req, res, u) {
  const result = [
    {
      id: 1,
      name: 'SUPER_ADMIN',
      description: '超级管理员',
    },
    {
      id: 2,
      name: 'ADVANCED_ADMIN',
      description: '高级管理员',
    },
    {
      id: 3,
      name: 'USER_ADMIN',
      description: '用户管理员',
    },
    {
      id: 4,
      name: 'PROJECT_USER',
      description: '数据处理人员',
    },
    {
      id: 5,
      name: 'DATASET_USER',
      description: '数据查看人员',
    },
  ];
  return res.json(result);
}

export default {
  // login
  'POST /api/login/account': login,

  // users manage.
  'GET /api/users/list': userList,
  'POST /api/users/create': createUser,
  'POST /api/users/delete': deleteUser,
  'GET /api/users/username': queryUserName,
  'POST /api/users/update': updateUser,
  'GET /api/users/roles': fetchRoles,
};
