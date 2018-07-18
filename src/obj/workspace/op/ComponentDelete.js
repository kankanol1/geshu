import Operation from './Operation';

export default class ComponentDelete extends Operation {
  component;
  constructor(component) {
    super();
    this.component = component;
  }

  do(canvas) {
    canvas.removeComponent(this.component);
  }

  undo(canvas) {
    canvas.addComponent(this.component);
  }
}
