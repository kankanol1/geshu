import { getRegisteredTypes, updateType } from '@/services/datapro/pipelineAPI';

export default {
  namespace: 'dataproPreviewTable',

  state: {
    pagination: {},
    table: {},
    loading: true,
    message: undefined,
    types: [],
  },

  reducers: {
    updateTableData(state, { payload }) {
      return { ...state, pagination: payload.pagination, table: payload.table };
    },

    updateTableStatus(state, { payload }) {
      const { status, message } = payload;
      return { ...state, loading: status === 'CALCULATING', message };
    },
    clear(state, { payload }) {
      return { loading: true, message: undefined, pagination: {}, table: {} };
    },

    storeTypes(state, { payload }) {
      return { ...state, types: payload };
    },

    updateTypeState(state, { payload }) {
      const { name, type } = payload;
      const newTypes = state.table.types.map(t => {
        if (t.name === name) {
          return { name, type };
        }
        return t;
      });
      return { ...state, table: { ...state.table, types: newTypes } };
    },
  },

  effects: {
    *onWSReceived({ payload }, { put }) {
      const { body: bs } = payload;
      const body = JSON.parse(bs);
      if (body.type === 'data') {
        yield put({
          type: 'updateTableData',
          payload: body.data,
        });
      } else if (body.type === 'status') {
        yield put({
          type: 'updateTableStatus',
          payload: body.data,
        });
      } else {
        console.error('Not handled type', body); // eslint-disable-line
      }
    },
    *preview({ payload }, { put, call }) {
      yield put({
        type: 'ws/send',
        payload: {
          topic: '/app/datapro/pipeline/preview',
          header: {},
          body: JSON.stringify(payload),
        },
      });
    },
    *fetchData({ payload }, { put, call }) {
      yield put({
        type: 'preview',
        payload,
      });
    },

    *fetchTypes({ payload }, { put, call }) {
      const response = yield call(getRegisteredTypes, payload);
      if (response) {
        yield put({ type: 'storeTypes', payload: response });
      }
    },
    *updateType({ payload }, { put, call }) {
      const response = yield call(updateType, payload);
      if (response && response.success) {
        yield put({ type: 'updateTypeState', payload });
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      let subscribed = false;
      const unsubscribeFunc = () => {
        dispatch({
          type: 'ws/unsubscribe',
          payload: {
            topic: `/datapro/pipeline/status/${subscribed.projectId}/${subscribed.componentId}`,
          },
        });
        subscribed = false;
      };
      history.listen(({ pathname }) => {
        if (
          pathname.startsWith('/projects/p/pipeline/') &&
          (pathname.includes('/new/') || pathname.includes('/conf/'))
        ) {
          const pathArr = pathname.split('/projects/p/pipeline/');
          // assert length = 2
          if (pathArr.length !== 2) return;
          const rest = pathArr[1];
          let arr = [];
          if (rest.includes('new')) {
            arr = rest.split('/new/');
          } else if (rest.includes('conf')) {
            arr = rest.split('/conf/');
          }
          const projectId = parseInt(arr[0], 10);
          const componentId = arr[1];

          if (
            subscribed &&
            (subscribed.projectId !== projectId || subscribed.componentId !== componentId)
          ) {
            // unsubscribe.
            unsubscribeFunc();
          } else if (!subscribed) {
            dispatch({
              type: 'ws/subscribe',
              payload: {
                topic: `/datapro/pipeline/preview/${projectId}/${componentId}`,
                callback: response => {
                  dispatch({
                    type: 'onWSReceived',
                    payload: response,
                  });
                },
              },
            });
            subscribed = { projectId, componentId };
            console.log('subscribed', subscribed); // eslint-disable-line
          }
          // subscribed = true;
        } else if (subscribed) {
          // unsubscribe.
          unsubscribeFunc();
        }
      });
    },
  },
};
