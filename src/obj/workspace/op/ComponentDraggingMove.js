import UntrackedOperation from './UntrackedOperation';

export default class ComponentDraggingMove extends UntrackedOperation {
  component;
  constructor(component, x, y) {
    super();
    this.component = component;
    this.x = x;
    this.y = y;
    this.originX = this.component.x;
    this.originY = this.component.y;
  }

  do(canvas) {
    canvas.moveComponent(this.component, this.x, this.y);
  }

  undo(canvas) {
    canvas.moveComponent(this.component, this.originX, this.originY);
  }
}
