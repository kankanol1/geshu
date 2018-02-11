import key from 'keymaster';
import { message } from 'antd';
import { calculatePointCenter, updateCache } from '../../utils/PositionCalculation';

export default {
  namespace: 'work_canvas',

  state: {
    components: [
      {
        id: 'input',
        name: 'CSV输入',
        code: 'csv-source',
        x: 150,
        y: 100,
        width: 120,
        height: 60,
        /** type means */
        type: 'source',
        points: [
          /* input circles */
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
        connectTo: [
          {
            /* connects to */
            component: 'preprocess-1',
            input: 'i-1',
            output: 'o-1',
          },
        ],
      },
      {
        id: 'preprocess-1',
        name: '列转换',
        code: 'column-transform',
        x: 400,
        y: 100,
        width: 120,
        height: 60,
        type: 'preprocessor',
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
        connectTo: [],
      },
    ],
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
    /* should be input or output. */
    draggingType: null,
    /** mode: select; move; */
    mode: 'select',
    selection: [
      // store selection.
      // e.g. {type: 'component', id: 'component-id'} => select single component.
      { type: 'line', from: 'o-1', to: 'i-1', source: 'input', target: 'preprocess-1' },
      { type: 'component', id: 'input' },
    ],
    offset: {
      x: 0,
      y: 0,
    },
    scale: 1.0,
    scaleCenter: {
      x: 0,
      y: 0,
    },
    runtime: {
      dragging: false,
      startX: 0,
      startY: 0,
      stopX: 0,
      stopY: 0,
    },
    /** store some cache to make calculation easier. */
    cache: {
      // store: componentid: {x, y, height, width}
      componentDict: {},
      // store: componentid: {pointid: {x, y}}
      pointDict: {},
    },
    contextmenu: {
      show: false,
      component: null,
      x: 0,
      y: 0,
    },
  },

  reducers: {
    init(state) {
      return updateCache(state);
    },

    openContextMenu(state, { component, x, y }) {
      return Object.assign({}, {
        ...state,
        ...{
          contextmenu: {
            show: true,
            component,
            x,
            y,
          },
        },
      });
    },

    modeChange(state, { isMoveMode }) {
      return Object.assign({}, {
        ...state,
        ...{
          mode: isMoveMode ? 'move' : 'select',
          contextmenu: {
            show: false,
            component: null,
            x: 0,
            y: 0,
          },
        },
      });
    },

    dragCanvas(state, { startX, startY, currentX, currentY }) {
      switch (state.mode) {
        case 'move':
          if (!state.runtime.dragging) {
            return Object.assign({}, {
              ...state,
              ...{
                runtime: {
                  dragging: false,
                  startX,
                  startY,
                  stopX: currentX + startX,
                  stopY: currentY + startY,
                },
                offset: {
                  x: state.offset.x + currentX,
                  y: state.offset.y + currentY,
                },
              },
            });
          } else {
            return Object.assign({}, {
              ...state,
              ...{
                runtime: {
                  ...state.runtime,
                  stopX: currentX + state.runtime.stopX,
                  stopY: currentY + state.runtime.stopY,
                },
                offset: {
                  x: state.offset.x + currentX,
                  y: state.offset.y + currentY,
                },
              },
            });
          }
        case 'select':
        default:
          if (!state.runtime.dragging) {
            return Object.assign({}, {
              ...state,
              ...{
                runtime: {
                  dragging: true,
                  startX,
                  startY,
                  stopX: currentX + startX,
                  stopY: currentY + startY,
                },
              },
            });
          } else {
            return Object.assign({}, {
              ...state,
              ...{
                runtime: {
                  ...state.runtime,
                  stopX: currentX + state.runtime.stopX,
                  stopY: currentY + state.runtime.stopY,
                },
              },
            }
            );
          }
      }
    },

    canvasDragStop(state) {
      // calculate selection area.
      const { offset } = state;
      const { startX, startY, stopX, stopY } = state.runtime;
      const { xMin, xMax } = startX > stopX ?
        { xMin: stopX, xMax: startX } : { xMin: startX, xMax: stopX };
      const { yMin, yMax } = startY > stopY ?
        { yMin: stopY, yMax: startY } : { yMin: startY, yMax: stopY };
      // first filter components in range.
      const selectedComponents = state.components.filter(
        (component) => {
          return component.x + offset.x > xMin && component.y + offset.y > yMin &&
            component.width + component.x + offset.x < xMax &&
            component.height + component.y + offset.y < yMax;
        }
      );

      const containedComponents = selectedComponents.map(c => c.id);

      const newSelection = [];
      selectedComponents.forEach(
        (component) => {
          component.connectTo.forEach(
            (line) => {
              if (containedComponents.includes(line.component)) {
                // add this line.
                newSelection.push({ type: 'line', from: line.output, to: line.input, source: component.id, target: line.component });
              }
            }
          );
          // add this component.
          newSelection.push({ type: 'component', id: component.id });
        }
      );
      return Object.assign({}, {
        ...state,
        ...{
          runtime: {
            dragging: false,
            startX: 0,
            startY: 0,
            stopX: 0,
            stopY: 0,
          },
          selection: newSelection,
        },
      });
    },

    deleteCurrentSelection(state) {
      // divide the selection to two different sets.
      const componentSelectionSet = [];
      const lineSelectionSet = [];
      state.selection.forEach(
        (select) => {
          if (select.type === 'component') {
            componentSelectionSet.push(select.id);
          } else if (select.type === 'line') {
            lineSelectionSet.push(`${select.source}-${select.from}-${select.target}-${select.to}`);
          }
        }
      );


      const originComponent = Object.assign([], state.components);
      const newComponents = originComponent.map(
        (component) => {
          if (componentSelectionSet.includes(component.id)) {
            return null;
          } else {
            // not included, needs to check the lines.
            const newConnectTo = component.connectTo.map(
              (item) => {
                if (lineSelectionSet.includes(`${component.id}-${item.output}-${item.component}-${item.input}`)) {
                  return null;
                } else if (componentSelectionSet.includes(item.component)) {
                  return null;
                } else return item;
              }
            );
            return Object.assign({}, { ...component,
              ...{ connectTo: newConnectTo.filter(a => a != null) } });
          }
        }
      );
      const newState = Object.assign({}, { ...state,
        ...{ components: newComponents.filter(a => a != null), selection: [] } });
      return newState;
    },

    updateComponentSelection(state, { id }) {
      return Object.assign({}, {
        ...state,
        ...{
          selection: [{ type: 'component', id }],
          contextmenu: {
            show: false,
            component: null,
            x: 0,
            y: 0,
          },
        },
      });
    },

    updateLineSelection(state, params) {
      const after = Object.assign({}, {
        ...state,
        ...{
          selection: [{ ...params, type: 'line' }],
          contextmenu: {
            show: false,
            component: null,
            x: 0,
            y: 0,
          },
        },
      });
      return after;
    },

    newComponent(state, { component }) {
      const { offset } = state;
      const components = Object.assign([], state.components);
      components.push({ ...component,
        ...{ x: component.x - offset.x,
          y: component.y - offset.y,
        },
      });
      return updateCache(Object.assign({}, { ...state, ...{ components } }));
    },

    moveComponent(state, { id, deltaX, deltaY, originX, originY }) {
      // get selected components.
      const selectedComponents = [];
      state.selection.forEach(
        (select) => {
          if (select.type === 'component') {
            selectedComponents.push(select.id);
          }
        }
      );
      let selection = null;
      const nr = state.components.map((component) => {
        if (selectedComponents.length === 0 && component.id === id) {
          // also update the selection.
          selection = [{ type: 'component', id }];
          return Object.assign({}, {
            ...component,
            ...{
              x: originX + deltaX, y: originY + deltaY,
            },
          });
        } else if (selectedComponents.includes(component.id)) {
          return Object.assign({}, {
            ...component,
            ...{
              x: component.x + deltaX, y: component.y + deltaY,
            },
          });
        } else if (component.id === id) {
          // change selection & move.
          selection = [{ type: 'component', id }];
          return Object.assign({}, {
            ...component,
            ...{
              x: originX + deltaX, y: originY + deltaY,
            },
          });
        } else return component;
      });

      if (selection == null) {
        return updateCache(Object.assign({}, {
          ...state,
          ...{
            components: nr,
            contextmenu: {
              show: false,
              component: null,
              x: 0,
              y: 0,
            },
          },
        }));
      } else {
        return updateCache(Object.assign({}, {
          ...state,
          ...{
            components: nr,
            contextmenu: {
              show: false,
              component: null,
              x: 0,
              y: 0,
            },
            selection,
          },
        }));
      }
    },

    draggingLine(state, { componentId, pointId, draggingSource, draggingTarget, draggingType }) {
      if (!state.dragging) {
        const newState = Object.assign({}, {
          ...state,
          ...{
            dragging: true,
            draggingSource,
            draggingComponent: componentId,
            draggingPoint: pointId,
            draggingTarget,
            draggingType,
          },
        });
        return newState;
      } else {
        const newState = Object.assign({}, { ...state, ...{ draggingTarget } });
        return newState;
      }
    },

    endDrag(state) {
      // the round range of judgement.
      const R = 10;
      const { offset } = state;
      // detect overlapping with other points.
      const overlapped = [];

      state.components.forEach((component) => {
        const { x, y, width, height } = component;
        component.points.forEach((input) => {
          const { px, py } = calculatePointCenter(x, y, width, height, input.x, input.y);
          if (Math.abs((px + offset.x) - state.draggingTarget.x) <=
            R && Math.abs((py + offset.y) - state.draggingTarget.y) <= R) {
            overlapped.push({
              componentId: component.id,
              pointId: input.id,
              type: input.type,
              connects: input.connects,
              metatype: input.metatype,
            });
          }
        });
      });

      if (overlapped.length !== 0) {
        const candidate = overlapped[0];
        if (candidate.componentId === state.draggingComponent) {
          message.info('暂不能将同一组件首位相连');
        } else if (candidate.connects.includes(state.draggingType)) {
          let newComponents = null;
          if (candidate.metatype === 'input') {
            // add connectTo to the dragging point.
            newComponents = state.components.map(
              (component) => {
                if (component.id === state.draggingComponent) {
                  const connectTo = Object.assign([], component.connectTo);
                  connectTo.push({ component: candidate.componentId,
                    input: candidate.pointId,
                    output: state.draggingPoint,
                  });
                  return Object.assign({}, { ...component, ...{ connectTo } });
                } else {
                  return component;
                }
              }
            );
          } else if (candidate.metatype === 'output') {
            // the other way round.
            newComponents = state.components.map(
              (component) => {
                if (component.id === state.draggingComponent) {
                  const connectTo = Object.assign([], component.connectTo);
                  connectTo.push({ component: candidate.componentId,
                    input: candidate.pointId,
                    output: state.draggingPoint,
                  });
                  return Object.assign({}, { ...component, ...{ connectTo } });
                } else {
                  return component;
                }
              }
            );
          }
          const n = Object.assign({}, {
            ...state,
            ...{
              components: newComponents,
              dragging: false,
              draggingTarget: { x: null, y: null },
              draggingSource: { x: null, y: null },
            },
          });
          return n;
        } else {
          message.info('无法连接具有相同类型的点');
        }
        return Object.assign({}, {
          ...state,
          ...{
            dragging: false,
            draggingTarget: { x: null, y: null },
            draggingSource: { x: null, y: null },
          },
        });
      }

      return Object.assign({}, {
        ...state,
        ...{
          dragging: false,
          draggingTarget: { x: null, y: null },
          draggingSource: { x: null, y: null },
        },
      });
    },
  },

  effects: {

    *updateComponentSelectionAndDisplaySettings({ component }, { put }) {
      yield put({ type: 'updateComponentSelection', id: component.id });
      yield put({ type: 'work_component_settings/displayComponentSetting', component });
    },

    *moveComponentAndDisplaySettingsIfNeeded(
      { component, deltaX, deltaY, originX, originY },
      { put, select }
    ) {
      yield put({ type: 'moveComponent', id: component.id, deltaX, deltaY, originX, originY });
      const currentState = yield select((state) => { return state.work_canvas; });
      // visit the num of selected components.
      let count = 0;
      currentState.selection.forEach(
        (s) => {
          if (s.type === 'component') {
            count = 1 + count;
          }
        }
      );
      // check if only one component is being selected.
      if (count === 1) {
        // means we can update the selection.
        yield put({
          type: 'work_component_settings/displayComponentSetting',
          component,
        });
      }
    },
  },

  subscriptions: {
    keyboardWatcher({ dispatch }) {
      key('del, delete', () => {
        return dispatch({
          type: 'deleteCurrentSelection',
        });
      });
    },
  },
};
