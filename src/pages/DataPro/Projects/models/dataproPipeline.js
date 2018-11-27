import { message } from 'antd';
import DataProCanvas from '@/obj/workspace/DataProCanvas';
import ComponentAdd from '@/obj/workspace/op/ComponentAdd';
import Component from '@/obj/workspace/Component';
import SelectionChange from '@/obj/workspace/op/SelectionChange';
import ComponentDelete from '@/obj/workspace/op/ComponentDelete';
import ConnectionDelete from '@/obj/workspace/op/ConnectionDelete';
import BatchOperation from '@/obj/workspace/op/BatchOperation';

import { getPipeline, deleteOperator } from '@/services/datapro/pipelineAPI';

export default {
  namespace: 'dataproPipeline',
  state: {
    // pipeline canvas.
    canvas: undefined,
    contextmenu: {
      show: false,
      component: null,
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 40,
    },
  },

  reducers: {
    savePipeline(state, { payload }) {
      const { components } = payload;
      return { ...state, canvas: DataProCanvas.fromJsonWithDataset(components) };
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
        });
      }
    },
  },

  subscriptions: {
    setup() {},
  },
};
