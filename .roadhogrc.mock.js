import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { imgMap } from './mock/utils';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';
import componentList from './mock/workspace/componentList'
import { wrapResponse } from './mock/response_wrapper'
import componentParams from './mock/workspace/componentParams'
import { getProject, createProject, updateProject, deleteProject, getProjectLabels, getRecentProjects } from './mock/project';
import { login, userList, createUser, deleteUser, queryUserName, updateUser } from './mock/user';
import { getModels, addModel, updateModel, deleteModels } from './mock/model';
import { getCandidateModels, updateCandidateModel, deleteCandidateModels, publishCandidateModels } from './mock/candidatemodel';
import { getJobs, stopJobs, resumeJobs, pauseJobs, deleteJobs, restartJobs } from './mock/job';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {

  'GET /api/workspace/component_list': componentList,
  'GET /api/workspace/component_param/:id':  (req, res) => {
      res.send(componentParams(req.params.id))
  },
  'GET /api/project/list': getProject,
  'POST /api/project/create': createProject,
  'POST /api/project/update': updateProject,
  'POST /api/project/delete': deleteProject,
  'GET /api/project/labels':  getProjectLabels,
  'GET /api/project/recent': getRecentProjects,

  // login
  'POST /api/login/account': login,
  
  // users manage.
  'GET /api/users/list': userList,
  'POST /api/users/create': createUser,
  'POST /api/users/delete': deleteUser,
  'GET /api/users/username': queryUserName,
  'POST /api/users/update': updateUser,

  // model manage.
  'GET /api/models/production/list': getModels,
  'POST /api/models/production/update': updateModel,
  'POST /api/models/production/delete': deleteModels,
  
  // candidate model manage.
  'GET /api/models/candidate/list': getCandidateModels,
  'POST /api/models/candidate/update': updateCandidateModel,
  'POST /api/models/candidate/delete': deleteCandidateModels,
  'POST /api/models/candidate/publish': publishCandidateModels,

  // job manage.
  'GET /api/jobs/list': getJobs,
  'POST /api/jobs/stop': stopJobs,
  'POST /api/jobs/resume': resumeJobs,
  'POST /api/jobs/pause': pauseJobs,
  'POST /api/jobs/remove': deleteJobs,
  'POST /api/jobs/restart': restartJobs,

  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  // 'POST /api/login/account': (req, res) => {
  //   const { password, userName, type } = req.body;
  //   if(password === '888888' && userName === 'admin'){
  //     res.send({
  //       status: 'ok',
  //       type,
  //       currentAuthority: 'admin'
  //     });
  //     return ;
  //   }
  //   if(password === '123456' && userName === 'user'){
  //     res.send({
  //       status: 'ok',
  //       type,
  //       currentAuthority: 'user'
  //     });
  //     return ;
  //   }
  //   res.send({
  //     status: 'error',
  //     type,
  //     currentAuthority: 'guest'
  //   });
  // },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      "timestamp": 1513932555104,
      "status": 500,
      "error": "error",
      "message": "error",
      "path": "/base/category/list"
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      "timestamp": 1513932643431,
      "status": 404,
      "error": "Not Found",
      "message": "No message available",
      "path": "/base/category/list/2121212"
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      "timestamp": 1513932555104,
      "status": 403,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      "timestamp": 1513932555104,
      "status": 401,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },
};

export default noProxy ? {} : delay(proxy, 1000);
