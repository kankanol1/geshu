import componentAPI from '../../services/componentAPI';

export default {
  namespace: 'work_component_list',

  state: {
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
            points: [
              {
                id: 'o-1',
                label: 'o',
                hint: 'data output', // occurs when hover
                x: 1,
                y: 0.5,
                type: 'datasource-output',
                metatype: 'output',
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
            points: [
              /* input circles */
              {
                id: 'i-1',
                label: 'i',
                hint: 'b', // occurs when hover
                x: 3,
                y: 0.5,
                type: 'datasource-input',
                metatype: 'input',
                connects: ['datasource-output'],
              },
              {
                id: 'o-1',
                label: 'o',
                hint: 'b', // occurs when hover
                x: 1,
                y: 0.5,
                type: 'datasource-output',
                metatype: 'output',
                connects: ['datasource-input'],
              },
            ],
          },
        ],
      },
    ],
    activekeys: ['input-group', 'transform-group'],
  },

  reducers: {
    replaceComponentList(state, { data }) {
      const activekeys = data.groups.map(
        (group) => { return group.key; }
      );
      return Object.assign({}, { ...state, ...{ groups: data.groups, activekeys } });
    },

  },

  effects: {
    *featchComponentList({ payload }, { call, put }) {
      const data = yield call(componentAPI.fetchComponentList);
      yield put({ type: 'replaceComponentList', data: data.data });
    },
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'featchComponentList',
      });
    },
  },
};
