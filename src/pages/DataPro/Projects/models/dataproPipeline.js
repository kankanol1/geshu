import { message } from 'antd';
import Canvas from '@/obj/workspace/Canvas';
import ComponentAdd from '@/obj/workspace/op/ComponentAdd';
import Component from '@/obj/workspace/Component';
import SelectionChange from '@/obj/workspace/op/SelectionChange';
import ComponentDelete from '@/obj/workspace/op/ComponentDelete';
import ConnectionDelete from '@/obj/workspace/op/ConnectionDelete';
import BatchOperation from '@/obj/workspace/op/BatchOperation';

const components = [
  {
    x: 455,
    y: 414,
    id: '分词15315274966',
    name: '分词',
    code: 'TokenizerStage',
    type: 'Stage',
    inputs: [
      {
        hint: 'all',
        x: 3,
        y: 0.5,
        id: 'i1',
        label: 'all',
        connects: ['Model', 'Dataset'],
      },
    ],
    outputs: [
      {
        hint: 'Model',
        x: 1,
        y: 0.5,
        id: 'o1',
        label: 'model',
        type: 'Model',
      },
    ],
    connectFrom: [],
  },
  {
    x: 461.5,
    y: 224.5,
    id: '分词1531527496608',
    name: '分词',
    code: 'TokenizerStage',
    type: 'Stage',
    inputs: [
      {
        hint: 'all',
        x: 3,
        y: 0.5,
        id: 'i1',
        label: 'all',
        connects: ['Model', 'Dataset'],
      },
    ],
    outputs: [
      {
        hint: 'Model',
        x: 1,
        y: 0.5,
        id: 'o1',
        label: 'model',
        type: 'Model',
      },
    ],
    connectFrom: [
      {
        component: '文件读取1531527496607',
        from: 'o1',
        to: 'i1',
      },
    ],
  },
  {
    x: 129,
    y: 196,
    id: '文件读取1531527496607',
    name: '文件读取',
    code: 'FileDataSource',
    type: 'DataSource',
    inputs: [],
    outputs: [
      {
        hint: 'Dataset',
        x: 1,
        y: 0.5,
        id: 'o1',
        label: 'data',
        type: 'Dataset',
      },
    ],
    connectFrom: [],
  },
  {
    x: 374,
    y: 303,
    id: 'Join1532467809093',
    name: 'Join',
    code: 'JoinTransformer',
    type: 'Transformer',
    inputs: [
      {
        hint: 'left',
        x: 3,
        y: 0.3333333333333333,
        id: 'i1',
        label: 'left',
        connects: ['Dataset'],
      },
      {
        hint: 'right',
        x: 3,
        y: 0.6666666666666666,
        id: 'i2',
        label: 'right',
        connects: ['Dataset'],
      },
    ],
    outputs: [
      {
        hint: 'Dataset',
        x: 1,
        y: 0.5,
        id: 'o1',
        label: 'data',
        type: 'Dataset',
      },
    ],
    connectFrom: [
      {
        component: '文件读取1531527496607',
        from: 'o1',
        to: 'i1',
      },
      {
        component: '文件读取1531527496607',
        from: 'o1',
        to: 'i2',
      },
    ],
  },
  {
    x: 648.75,
    y: 345,
    id: '向量组装1535487929871',
    name: '向量组装',
    code: 'VectorAssemblerPStage',
    type: 'PStage',
    inputs: [
      {
        hint: 'dataset',
        x: 3,
        y: 0.5,
        id: 'i1',
        label: 'dataset',
        connects: ['Model', 'Dataset'],
      },
    ],
    outputs: [
      {
        hint: 'Model',
        x: 1,
        y: 0.5,
        id: 'o1',
        label: 'model',
        type: 'Model',
      },
    ],
    connectFrom: [],
  },
];

export default {
  namespace: 'dataproPipeline',
  state: {
    canvas: Canvas.fromJsonWithDataset(components, 0, 0, 200),
  },

  reducers: {
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

  effects: {},

  subscriptions: {
    setup() {},
  },
};
