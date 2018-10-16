import { fetchComponentList } from '@/services/componentAPI';
import translateName from '@/config/ComponentNameMapping';

const groupOrder = [
  'DataSource',
  'ModelSource',
  'Transformer',
  'Feature',
  'Regression',
  'Classification',
  'Clustering',
  'Tuner',
  'ModelSink',
  'DataSink',
  'Predictor',
];

export default {
  namespace: 'work_component_list',

  state: {
    // this state record current state of this data
    state: {
      lastSync: -1,
    },
    groups: [
      // component group.
      {
        name: '输入组件',
        key: 'source',
        components: [
          // component.
          {
            name: 'csv输入',
            type: 'source',
            code: 'csv-source',
            inputs: [],
            outputs: [
              {
                id: 'o-1',
                label: 'o',
                hint: 'data output', // occurs when hover
                x: 1,
                y: 0.5,
                connects: ['datasource-input'],
              },
            ],
          },
        ],
      },
      {
        name: '数据转换组件',
        key: 'transform',
        components: [
          {
            name: '列转换',
            type: 'preprocessor',
            code: 'column-transform',
            inputs: [
              {
                id: 'i-1',
                label: 'i',
                hint: 'b', // occurs when hover
                x: 3,
                y: 0.5,
                connects: ['datasource-output'],
              },
            ],
            outputs: [
              {
                id: 'o-1',
                label: 'o',
                hint: 'b', // occurs when hover
                x: 1,
                y: 0.5,
                type: 'datasource-output',
              },
            ],
          },
        ],
      },
    ],
    // store all the data fetched from server.
    allGroups: [],
    activekeys: ['input-group', 'transform-group'],
    show: true,
  },

  reducers: {
    replaceComponentList(state, { data }) {
      const activekeys = data.map(group => {
        return group.key;
      });
      const keyedGroup = {};
      data.forEach(g => {
        keyedGroup[g.key] = g;
      });
      const orderedGroup = [];
      // change order.
      groupOrder.forEach(v => orderedGroup.push(keyedGroup[v]));
      // end.
      return Object.assign(
        {},
        {
          ...state,
          state: { lastSync: Date.now() },
          groups: orderedGroup,
          allGroups: orderedGroup,
          activekeys,
        }
      );
    },

    filterComponent(state, { payload }) {
      const { allGroups } = state;
      const filter = payload.filter.toLowerCase();
      if (filter && filter !== '') {
        const filteredGroup = allGroups.map(group => {
          return {
            ...group,
            components: group.components.filter(c => c.name.toLowerCase().indexOf(filter) >= 0),
          };
        });
        return Object.assign(
          {},
          {
            ...state,
            groups: filteredGroup.filter(g => g.components.length > 0),
          }
        );
      } else {
        return Object.assign({}, { ...state, groups: allGroups });
      }
    },
  },

  effects: {
    *fetchComponentList({ payload }, { call, put }) {
      const data = yield call(fetchComponentList);
      if (data) {
        const translatedData = data.map(group => {
          const newComponents = group.components.map(component => {
            return { ...component, name: translateName(component.name) };
          });
          return { ...group, components: newComponents, name: translateName(group.name) };
        });
        yield put({ type: 'replaceComponentList', data: translatedData });
      }
    },
  },

  subscriptions: {},
};
