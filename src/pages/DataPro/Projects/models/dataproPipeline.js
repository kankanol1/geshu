import { message } from 'antd';
import DataProCanvas from '@/obj/workspace/DataProCanvas';
import ComponentAdd from '@/obj/workspace/op/ComponentAdd';
import Component from '@/obj/workspace/Component';
import SelectionChange from '@/obj/workspace/op/SelectionChange';
import ComponentDelete from '@/obj/workspace/op/ComponentDelete';
import ConnectionDelete from '@/obj/workspace/op/ConnectionDelete';
import BatchOperation from '@/obj/workspace/op/BatchOperation';

import { getPipeline } from '@/services/datapro/pipelineAPI';

export default {
  namespace: 'dataproPipeline',
  state: {
    // pipeline canvas.
    canvas: undefined,
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
  },

  effects: {
    *loadPipeline({ payload, callback }, { call, put }) {
      const response = yield call(getPipeline);
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
  },

  subscriptions: {
    setup() {},
  },
};
