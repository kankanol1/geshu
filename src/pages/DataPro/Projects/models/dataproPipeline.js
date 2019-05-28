import DataProCanvas from '@/obj/workspace/DataProCanvas';
import SelectionChange from '@/obj/workspace/op/SelectionChange';
import { message, Modal } from 'antd';

import {
  getPipeline,
  deleteOperator,
  runToOperator,
  invalidOperator,
} from '@/services/datapro/pipelineAPI';

export default {
  namespace: 'dataproPipeline',
  state: {
    // pipeline canvas.
    canvas: undefined,
    status: undefined,
    logs: [],
    contextmenu: {
      show: false,
      component: null,
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 40,
    },
    modifyingComponent: undefined,
    inspecting: undefined,
    savingDataset: undefined,
    inspectingSchema: undefined,
  },

  reducers: {
    savePipeline(state, { payload }) {
      const { components, offset, scale, status, logs } = payload;
      return {
        ...state,
        canvas: DataProCanvas.fromJson(components, offset.x, offset.y, scale),
        status,
        logs,
      };
    },

    triggerCanvasUpdate(state, { payload }) {
      return { ...state, state: { ...state.state, dirty: true }, canvas: payload.canvas };
    },

    canvasSelectionChange(state, { payload }) {
      const { canvas } = state;
      const { newSelection } = payload;
      if (!canvas.isCurrentSelection(newSelection)) {
        // new selection.
        canvas.apply(new SelectionChange(newSelection));
        return { ...state, canvas };
      }
      return state;
    },

    openContextMenu(state, { component, x, y }) {
      // change selection to this component.
      state.canvas.apply(new SelectionChange([{ type: 'component', id: component.id }]));
      return {
        ...state,
        contextmenu: {
          ...state.contextmenu,
          show: true,
          component,
          x,
          y,
        },
      };
    },

    hideContextMenu(state) {
      return {
        ...state,
        contextmenu: {
          ...state.contextmenu,
          show: false,
        },
      };
    },

    modifyComponent(state, { payload }) {
      return { ...state, modifyingComponent: payload.component };
    },

    onStatusUpdated(state, { payload }) {
      const responseStr = payload.body;
      const { status, logs } = JSON.parse(responseStr);
      return { ...state, status, logs: [...state.logs, ...logs] };
    },

    setInspectingComponent(state, { payload }) {
      const { component, error } = payload;
      const newComponent = component && { ...component, error };
      return { ...state, inspecting: newComponent };
    },

    updateSavingDataset(state, { payload }) {
      const { dataset } = payload;
      return { ...state, savingDataset: dataset };
    },
    setInspectingSchema(state, { payload }) {
      const { component } = payload;
      return { ...state, inspectingSchema: component };
    },
  },

  effects: {
    *loadPipeline({ payload, callback }, { call, put }) {
      const response = yield call(getPipeline, payload);
      if (response) {
        yield put({
          type: 'savePipeline',
          payload: response,
        });
        if (callback) {
          callback();
        }
      }
    },

    *deleteOp({ payload }, { call, put }) {
      const response = yield call(deleteOperator, payload);
      yield put({
        type: 'hideContextMenu',
      });
      if (response && response.success) {
        yield put({
          type: 'loadPipeline',
          payload: {
            id: payload.projectId,
          },
        });
      }
    },

    *updateCanvas({ payload }, { put }) {
      yield put({
        type: 'triggerCanvasUpdate',
        payload,
      });
      // only update positions
      const { canvas } = payload;

      const components = canvas.components.map(i => ({ id: i.id, x: i.x, y: i.y }));
      const { offset, scale } = canvas;
      // send websocket.
      yield put({
        type: 'ws/send',
        payload: {
          topic: '/app/datapro/pipeline/update',
          header: {},
          body: JSON.stringify({ components, offset, scale, projectId: payload.projectId }),
        },
      });
    },

    *runToOp({ payload }, { put, call }) {
      const response = yield call(runToOperator, payload);
      if (response && response.success) {
        message.info(response.message);
      } else {
        Modal.error({
          title: '执行出错',
          content: (response && response.message) || '执行出错，请重试',
        });
      }
    },

    *invalidOp({ payload }, { put, call }) {
      const response = yield call(invalidOperator, payload);
      if (response && response.success) {
        message.info(response.message);
      } else {
        Modal.error({
          title: '执行出错',
          content: (response && response.message) || '执行出错，请重试',
        });
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      let subscribed = false;
      history.listen(({ pathname }) => {
        if (!subscribed && pathname.startsWith('/projects/p/pipeline/')) {
          const pathArr = pathname.split('/projects/p/pipeline/');
          if (pathArr.length === 2) {
            const projectId = parseInt(pathArr[1], 10);
            dispatch({
              type: 'ws/subscribe',
              payload: {
                topic: `/datapro/pipeline/status/${projectId}`,
                callback: response => {
                  dispatch({
                    type: 'onStatusUpdated',
                    payload: response,
                  });
                },
              },
            });
            subscribed = projectId;
            console.log('subscribed', projectId); // eslint-disable-line
          }
          // subscribed = true;
        } else if (subscribed && !pathname.startsWith('/projects/p/pipeline')) {
          // unsubscribe.
          dispatch({
            type: 'ws/unsubscribe',
            payload: {
              topic: `/datapro/pipeline/status/${subscribed}`,
            },
          });
          subscribed = false;
        }
      });
    },
  },
};
