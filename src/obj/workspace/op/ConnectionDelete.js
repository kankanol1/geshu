import Operation from './Operation';

export default class ConnectionDelete extends Operation {
  component;
  connection;

  constructor(component, connection) {
    super();
    this.component = component;
    this.connection = connection;
  }

  do(canvas) {
    this.component.deleteConnection(this.connection);
  }

  undo(canvas) {
    this.component.addConnection(this.connection);
  }
}
