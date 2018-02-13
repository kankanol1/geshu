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
        inputs: [
        ],
        outputs: [
          /* input circles */
          {
            id: 'o-1',
            label: 'o',
            hint: 'data output', // occurs when hover
            x: 1,
            y: 0.5,
            connects: ['datasource-input'],
          },
        ],
        connectFrom: [
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
          }
        ],
        connectFrom: [],
      },
    ],
    // this state is used for detect line connection dragging event.
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
      /** should be the available input types if metatype is input, otherwise empty*/
      draggingConnects: [],
      /* should be input or output. */
      draggingMetaType: null,
    },
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

    draggingLine(state, { componentId, pointId, draggingSource, 
        draggingTarget, draggingType, draggingConnects, draggingMetaType }) {
          console.log('connects, type,', draggingConnects, draggingType)
      if (!state.lineDraggingState.dragging) {
        const newState = Object.assign({}, {
          ...state,
          lineDraggingState: {
            dragging: true,
            draggingSource,
            draggingComponent: componentId,
            draggingPoint: pointId,
            draggingTarget,
            draggingType,
            draggingConnects,
            draggingMetaType
          },
        });
        return newState;
      } else {
        const newState = Object.assign({}, { ...state,
          lineDraggingState: { ...state.lineDraggingState, draggingTarget } });
        return newState;
      }
    },

    endDrag(state) {
      // the round range of judgement.
      const R = 10;
      const { offset } = state;
      // detect overlapping with other points.
      const overlappedOutputs = [];
      const overlappedInputs = [];

      const { draggingComponent, draggingPoint, draggingSource,
        draggingTarget, draggingType,
        draggingConnects, draggingMetaType } = state.lineDraggingState;

      const pointIterationFunc = (input, overlapped, component) =>  {
        const { x, y, width, height } = component;
        const { px, py } = calculatePointCenter(x, y, width, height, input.x, input.y);
        if (Math.abs((px + offset.x) - draggingTarget.x) <=
          R && Math.abs((py + offset.y) - draggingTarget.y) <= R) {
          overlapped.push({
            componentId: component.id,
            pointId: input.id,
            type: input.type,
            connects: input.connects,
            metatype: input.metatype,
          });
        }
      };

      state.components.forEach((component) => {
        component.inputs.forEach((input) => pointIterationFunc(input, overlappedInputs, component));
        component.outputs.forEach((input) => pointIterationFunc(input, overlappedOutputs, component));
      });

      let newComponents = null;
      if (overlappedInputs.length !== 0) {
          if (draggingMetaType === 'output') {
            const candidate = overlappedInputs[0];
            // candidate is input, meaning dragging source should be an output.
            // add connectFrom to the candidate point.
            newComponents = state.components.map(
              (component) => {
                if (component.id === candidate.componentId) {
                  const connectFrom = Object.assign([], component.connectFrom);
                  connectFrom.push({ component: draggingComponent,
                    input: draggingPoint,
                    output: candidate.pointId,
                  });
                  return Object.assign({}, { ...component, ...{ connectFrom } });
                } else {
                  return component;
                }
              }
            );
          } else {
            message.info("needs to be connected with an input point");
          }
      }
      if (overlappedOutputs.length !== 0) {
        if (draggingMetaType === 'input') {
          const candidate = overlappedOutputs[0];
          // candidate is output, meansing dragging source should be an input.
          // the other way round.
          if (candidate.componentId === draggingComponent) {
            message.info('暂不能将同一组件首位相连');
          } else if(draggingConnects.includes(candidate.type)){
            newComponents = state.components.map(
              (component) => {
                if (component.id === draggingComponent) {
                  const connectFrom = Object.assign([], component.connectFrom);
                  connectFrom.push({ component: candidate.componentId,
                    input: candidate.pointId,
                    output: draggingPoint,
                  });
                  return Object.assign({}, { ...component, ...{ connectFrom } });
                } else {
                  return component;
                }
              }
            );
          } else {
            message.info("not compatiable");
          }
        } else {
          message.info("needs to be connected with an output point");
        }
        
      }

      if (newComponents !== null) {
        return Object.assign({}, {
          ...state,
          ...{
            components: newComponents,
            lineDraggingState: {
              ...state.lineDraggingState,
              dragging: false,
              draggingTarget: { x: null, y: null },
              draggingSource: { x: null, y: null },
            }
          },
        });
      }
      

      // return.
      return Object.assign({}, {
        ...state,
        lineDraggingState: {
          ...state.lineDraggingState,
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
