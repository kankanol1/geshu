import Operation from './Operation';

export default class ComponentAdd extends Operation {
  component;
  constructor(component) {
    super();
    this.component = component;
  }

  do(canvas) {
    canvas.addComponent(this.component);
  }

  undo(canvas) {
    canvas.removeComponent(this.component);
  }
}
