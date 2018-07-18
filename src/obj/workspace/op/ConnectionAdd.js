import Operation from './Operation';

export default class ConnectionAdd extends Operation {
  component;
  connection;

  constructor(component, connection) {
    super();
    this.component = component;
    this.connection = connection;
  }

  do(canvas) {
    this.component.addConnection(this.connection);
  }

  undo(canvas) {
    this.component.deleteConnection(this.connection);
  }
}
