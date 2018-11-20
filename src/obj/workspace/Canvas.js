import Component from './Component';
import Operation from './op/Operation';
import UntrackedOperation from './op/UntrackedOperation';
import {
  updateCache,
  updateCacheForComponent,
  getComponentSize,
} from '../../utils/PositionCalculation';

/* representing a pipline canvas. */

const maxHistoryNum = 100;

export default class Canvas {
  // display dataset.
  extraWidth = 0;

  /* ===== related with history management ==== */
  opHistory = [];

  currentOp = 0;
  /* ================================= */

  components = [];

  selection = [];

  componentPositionCache = {};

  componentSocketPositionCache = {};

  /**
   * for display.
   */
  offset = { x: 0, y: 0 };

  scale = 0.8;

  updated = 0;

  apply(op) {
    if (!(op instanceof Operation)) {
      throw new TypeError('must give an instance of an operation');
    }
    if (!(op instanceof UntrackedOperation)) {
      this.opHistory = this.opHistory.slice(
        Math.max(this.opHistory.length - maxHistoryNum - 1, 0),
        this.currentOp
      );
      this.currentOp = Math.min(this.currentOp, this.opHistory.length);
      this.opHistory.push(op);
      this.currentOp++;
    }
    op.do(this);
    this.notifyUpdate();
  }

  notifyUpdate() {
    this.updated = new Date().getTime();
  }

  undo() {
    if (this.currentOp === 0) return;
    this.updated = true;
    this.currentOp--;
    const op = this.opHistory[this.currentOp];
    op.undo(this);
    this.notifyUpdate();
  }

  redo() {
    if (this.currentOp === this.opHistory.length) return;
    this.updated = true;
    const op = this.opHistory[this.currentOp];
    this.currentOp++;
    op.do(this);
    this.notifyUpdate();
  }

  canUndo() {
    return this.currentOp !== 0;
  }

  canRedo() {
    return this.currentOp !== this.opHistory.length;
  }

  addComponent(component) {
    this.updated = true;
    this.components.push(component);
    // create cache.
    const { c, p } = updateCacheForComponent(component, this.offset, this.extraWidth);
    this.componentPositionCache[component.id] = c;
    this.componentSocketPositionCache[component.id] = p;
    this.notifyUpdate();
  }

  moveComponent(component, x, y) {
    component.move(x, y);
    // update cache.
    const { c, p } = updateCacheForComponent(component, this.offset, this.extraWidth);
    this.componentPositionCache[component.id] = c;
    this.componentSocketPositionCache[component.id] = p;
    this.notifyUpdate();
  }

  removeComponent(c) {
    this.updated = true;
    this.components = this.components.filter(i => i.id !== c.id);
    this.notifyUpdate();
  }

  setOffset(x, y) {
    this.updated = true;
    this.offset = { x, y };
    // update cache.
    const { componentDict, pointDict } = updateCache(this.components, this.offset, this.extraWidth);
    this.componentPositionCache = componentDict;
    this.componentSocketPositionCache = pointDict;
    // component update.
    this.components.forEach(c => c.notifyUpdate());
    this.notifyUpdate();
  }

  getSelectionInRange(xMin, yMin, xMax, yMax) {
    // first filter components in range.
    const componentSize = getComponentSize();
    const selectedComponents = Object.entries(this.componentPositionCache).filter(entry => {
      const component = entry[1];
      return (
        component.x > xMin &&
        component.y > yMin &&
        component.x + componentSize.width < xMax &&
        component.y + componentSize.height < yMax
      );
    });
    const containedComponents = selectedComponents.map(c => c[0]);
    const newSelection = [];
    this.components.filter(c => containedComponents.includes(c.id)).forEach(component => {
      component.connections.forEach(line => {
        // add this line.
        newSelection.push({
          type: 'line',
          from: line.from,
          to: line.to,
          target: component.id,
          source: line.component,
        });
      });
      // add this component.
      newSelection.push({ type: 'component', id: component.id });
    });
    return newSelection;
  }

  setSelection(selection) {
    this.updated = true;
    this.selection = selection;
    this.notifyUpdate();
  }

  getAllSelection() {
    const newSelection = [];
    this.components.forEach(
      //   { type: 'line', from: 'o-1', to: 'i-1', source: 'input', target: 'preprocess-1' },
      // { type: 'component', id: 'input' },
      c => {
        newSelection.push({
          type: 'component',
          id: c.id,
        });
        // get line.
        c.connections.forEach(to =>
          newSelection.push({
            type: 'line',
            source: to.component,
            from: to.from,
            target: c.id,
            to: to.to,
          })
        );
      }
    );
    return newSelection;
  }

  isCurrentSelection(newSelection) {
    if (newSelection.length !== this.selection.length) return false;
    // to string.
    const transform = i => `${i.type}-${i.id}-${i.source}-${i.from}-${i.target}-${i.to}`;
    const oldSelectionStr = this.selection.map(i => transform(i));
    const newSelectionStr = newSelection.map(i => transform(i));
    const result = newSelectionStr.filter(i => !oldSelectionStr.includes(i)).length === 0;
    return result;
  }

  getSelectedComponents() {
    const selectedCIds = this.selection.filter(i => i.type === 'component').map(i => i.id);
    return this.components.filter(c => selectedCIds.includes(c.id));
  }

  setScale(newScale) {
    this.scale = newScale;
    this.notifyUpdate();
  }

  // getSelection(x, y, width, height) {
  //   // return
  // }

  toJson() {
    // output to json.
    return this.components.map(c => c.toJson());
  }

  static fromJson(json, x = 0, y = 0) {
    const canvas = new Canvas();
    canvas.components = json.map(i => Component.fromJson(i));
    // calculate cache.
    canvas.setOffset(x, y);
    return canvas;
  }

  static fromJsonWithDataset(json, x = 0, y = 0, extraWidth = 100) {
    const canvas = new Canvas();
    canvas.extraWidth = extraWidth;
    canvas.components = json.map(i => Component.fromJson(i));
    // calculate cache.
    canvas.setOffset(x, y);
    return canvas;
  }
}
