import { message } from 'antd';
import { openProject, saveProject } from '../../services/componentAPI';
import Canvas from '../../obj/workspace/Canvas';
import ComponentAdd from '../../obj/workspace/op/ComponentAdd';
import Component from '../../obj/workspace/Component';
import SelectionChange from '../../obj/workspace/op/SelectionChange';
import ComponentDelete from '../../obj/workspace/op/ComponentDelete';
import ConnectionDelete from '../../obj/workspace/op/ConnectionDelete';
import BatchOperation from '../../obj/workspace/op/BatchOperation';

function appendMessage(messages, m) {
  messages.unshift({ message: m, time: Date.now() });
  return messages;
}

function initMessage() {
  return [{ message: '加载中...', time: Date.now() }];
}


export default {

  namespace: 'workcanvas',

  state: {
    tips: {
      show: true,
      maxMessage: 10,
      messages: [
      ],
    },
    state: {
      projectId: undefined,
      lastSync: -1,
      dirty: false,
    },
    name: undefined,
    canvas: undefined,
    mode: 'select',
    contextmenu: {
      show: false,
      component: null,
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 0,
    },
    schema: undefined,
    validation: {},
    // store some runtime data.
    runtime: {
      lineDraggingState: {
        dragging: false,
        draggingComponent: null,
        draggingPoint: null,
        draggingSource: {
          x: null,
          y: null,
        },
        draggingTarget: {
          x: null,
          y: null,
        },
        /** should be the output type if metatype is output, otherwise null */
        draggingType: null,
        /** should be the available input types if metatype is input, otherwise empty */
        draggingConnects: [],
        /* should be input or output. */
        draggingMetaType: null,
      },
      draggingSelection: {
        dragging: false,
        startX: 0,
        startY: 0,
        stopX: 0,
        stopY: 0,
      },
    },
  },

  reducers: {

    addMessage(state, { payload }) {
      return { ...state,
        tips: {
          ...state.tips, messages: appendMessage(state.tips.messages, payload.message),
        } };
    },

    saveProjectInfoToState(state, { payload }) {
      const canvas = Canvas.fromJson(payload.components);
      const { name, schema, validation } = payload;
      return { ...state,
        canvas,
        name,
        schema,
        validation,
        tips: { ...state.tips, messages: appendMessage(state.tips.messages, '加载完毕') },
        state: { projectId: payload.id, lastSync: Date.now(), dirty: false } };
    },

    triggerCanvasUpdate(state, { payload }) {
      return { ...state, state: { ...state.state, dirty: true }, canvas: payload.canvas };
    },

    updateProjectSchema(state, { payload }) {
      const { schema, validation } = payload;
      return { ...state, schema, validation, state: { ...state.state, dirty: false } };
    },


    /* add new component to canvas */
    canvasNewComponent(state, { component }) {
      const { canvas } = state;
      const { offset } = canvas;
      const { width, height, ...c } = component;
      const nc = { ...c,
        ...{ x: (component.x - offset.x) * (1 / canvas.scale),
          y: (component.y - offset.y) * (1 / canvas.scale),
        },
      };
      const newC = Component.fromJson(nc);
      canvas.apply(new ComponentAdd(newC));
      return { ...state, canvas, state: { ...state.state, dirty: true } };
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

    /* update dragging line on canvas */
    canvasDraggingLineUpdate(state, { componentId, pointId, draggingSource,
      draggingTarget, draggingType, draggingConnects, draggingMetaType }) {
      if (!state.runtime.lineDraggingState.dragging) {
        const newState = Object.assign({}, {
          ...state,
          runtime: {
            ...state.runtime,
            lineDraggingState: {
              dragging: true,
              draggingSource,
              draggingComponent: componentId,
              draggingPoint: pointId,
              draggingTarget,
              draggingType,
              draggingConnects,
              draggingMetaType,
            },
          },
        });
        return newState;
      } else {
        const newState = Object.assign({}, { ...state,
          runtime: {
            ...state.runtime,
            lineDraggingState: { ...state.runtime.lineDraggingState, draggingTarget } } });
        return newState;
      }
    },
    /* reset dragging line on canvas */
    canvasDraggingLineReset(state) {
      return {
        ...state,
        runtime: {
          ...state.runtime,
          lineDraggingState: {
            ...state.runtime.lineDraggingState,
            dragging: false,
            draggingTarget: { x: null, y: null },
            draggingSource: { x: null, y: null },
          },
        },
      };
    },

    /* undo for canvas */
    canvasUndo(state) {
      state.canvas.undo();
      // trigger update.
      return { ...state };
    },

    canvasRedo(state) {
      state.canvas.redo();
      return { ...state };
    },

    canvasSelectAll(state) {
      state.canvas.apply(new SelectionChange(state.canvas.getAllSelection()));
      return { ...state };
    },

    canvasClearSelection(state) {
      state.canvas.apply(new SelectionChange([]));
      return { ...state };
    },

    contextMenuOffsetInit(state, { payload }) {
      return { ...state, contextmenu: { ...state.contextmenu, ...payload } };
    },

    openContextMenu(state, { component, x, y }) {
      // change selection to this component.
      state.canvas.apply(new SelectionChange([
        { type: 'component', id: component.id },
      ]));
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
    *initProject({ payload }, { put, call }) {
      const response = yield call(openProject, payload.id);
      // save to this.
      const { settings, components, ...rest } = response;
      yield put({
        type: 'saveProjectInfoToState',
        payload: {
          ...rest,
          components,
          id: payload.id,
        },
      });
      // save settings.
      yield put({
        type: 'work_component_settings/initSettings',
        payload: {
          settings,
        },
      });
    },

    *saveProject({ _ }, { put, call, select }) {
      const currentState = yield select(state => state.workcanvas);
      if (!currentState.state.dirty) {
        message.info('保存成功');
        return;
      }
      const response = yield call(saveProject,
        { id: currentState.state.projectId, payload: { components: currentState.canvas.toJson() } }
      );
      if (response.success) {
        message.info('保存成功');
        yield put({
          type: 'updateProjectSchema',
          payload: {
            schema: response.schema,
            validation: response.validation,
          },
        });
        // yield put({
        //   type: 'saveState',
        //   payload: {
        //     dirty: false,
        //   },
        // });
      } else {
        message.error('保存出错！请检查重试');
      }
      yield put({
        type: 'addMessage',
        payload: {
          message: `项目保存${response.success ? '成功' : '失败'}`,
        },
      });
    },

    *canvasDeleteSelected({ payload }, { put, call, select }) {
      const { canvas } = yield select(state => state.workcanvas);
      // divide the selection to two different sets.
      const componentSelectionSet = [];
      const lineSelectionSet = [];
      canvas.selection.forEach(
        (s) => {
          if (s.type === 'component') {
            componentSelectionSet.push(s.id);
          } else if (s.type === 'line') {
            lineSelectionSet.push(`${s.source}-${s.from}-${s.target}-${s.to}`);
          }
        }
      );
      const batchOps = [];
      canvas.components.forEach((component) => {
        if (componentSelectionSet.includes(component.id)) {
          batchOps.push(new ComponentDelete(component));
        } else {
          // not included, needs to check the lines.
          component.connections.forEach((item) => {
            if (
              lineSelectionSet.includes(`${item.component}-${item.from}-${component.id}-${item.to}`)
              || componentSelectionSet.includes(item.component)) {
              batchOps.push(new ConnectionDelete(component, item));
            }
          });
        }
      });
      // clear selection.
      batchOps.push(new SelectionChange([]));
      canvas.apply(new BatchOperation(batchOps));
      yield put({
        type: 'triggerCanvasUpdate',
        payload: {
          canvas,
        },
      });
      yield put({
        type: 'work_component_settings/deleteSettingsById',
        payload: {
          ids: componentSelectionSet,
        },
      });
    },
  },

};
