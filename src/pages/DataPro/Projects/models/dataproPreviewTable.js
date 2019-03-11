import { previewTransformationResult } from '@/services/datapro/pipelineAPI';
import { isUndefined } from 'util';

export default {
  namespace: 'dataproPreviewTable',

  state: {
    pagination: {},
    table: {},
    loading: true,
    message: undefined,
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
  },

  subscriptions: {
    setup({ dispatch, history }) {
      let subscribed = false;
      history.listen(({ pathname }) => {
        if (
          !subscribed &&
          pathname.startsWith('/projects/p/pipeline/') &&
          (pathname.includes('/new/') || pathname.includes('/conf/'))
        ) {
          const pathArr = pathname.split('/projects/p/pipeline/');
          if (pathArr.length === 2) {
            const rest = pathArr[1];
            let arr = [];
            if (rest.includes('new')) {
              arr = rest.split('/new/');
            } else if (rest.includes('conf')) {
              arr = rest.split('/conf/');
            }
            const projectId = parseInt(arr[0], 10);
            const componentId = arr[1];
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
        } else if (subscribed && !pathname.startsWith('/projects/p/pipeline')) {
          // unsubscribe.
          dispatch({
            type: 'ws/unsubscribe',
            payload: {
              topic: `/datapro/pipeline/status/${subscribed.projectId}/${subscribed.componentId}`,
            },
          });
          subscribed = false;
        }
      });
    },
  },
};
