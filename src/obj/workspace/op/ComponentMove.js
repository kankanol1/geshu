import Operation from './Operation';

export default class ComponentMove extends Operation {
  component;
  constructor(component, originX, originY, x, y) {
    super();
    this.component = component;
    this.originX = originX;
    this.originY = originY;
    this.x = x;
    this.y = y;
  }

  do(canvas) {
    canvas.moveComponent(this.component, this.x, this.y);
  }

  undo(canvas) {
    canvas.moveComponent(this.component, this.originX, this.originY);
  }
}
