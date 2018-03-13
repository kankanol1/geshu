import moment from 'moment';
import { getUrlParams } from './utils';


const models = [
  { id: 'gen-1',
    name: '模型1',
    projectName: 'project1',
    projectId: '0',
    createdAt: moment('2018-03-02', 'YYYY-MM-DD'),
  },
];

for (let i = 0; i < 66; i += 1) {
  models.push({
    id: `gen${i}`,
    name: `模型${i}`,
    projectName: 'project1',
    projectId: '0',
    createdAt: moment('2018-03-02', 'YYYY-MM-DD'),
  });
}

export default models;
