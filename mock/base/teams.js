import faker from 'faker';
import moment from 'moment';
import fs from 'fs';
import { getUrlParams } from '../utils';

faker.locale = 'zh_CN';

const teams = [];

const roles = [
  { id: 0x101, name: 'GUEST', description: '访客' },
  { id: 0x102, name: 'REPORTER', description: '汇报人员' },
  { id: 0x103, name: 'DEVELOPER', description: '开发人员' },
  { id: 0x104, name: 'MANAGER', description: '管理员' },
  { id: 0x105, name: 'OWNER', description: '所有者' },
];

for (let i = 0; i < 5; i += 1) {
  const role = roles[i];
  teams.push({
    avatar: null,
    expiresAt: null,
    name: `${faker.random.word()}`,
    id: i,
    description: faker.hacker.phrase(),
    roleId: role.id,
    roleName: role.name,
    roleDescription: role.description,
  });
}

function getTeamList(req, res) {
  res.json(teams);
}

export default {
  'GET /api/teams/list': getTeamList,
};
