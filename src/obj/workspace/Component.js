import Socket from './Socket';
import Connection from './Connection';

export default class Component {
  id;
  name;
  code;
  x;
  y;
  type;
  inputs = [];
  outputs = [];
  connections = [];
  // update means whether the position/display of this component is changed.
  updated = false;

  constructor(id, name, code, x, y, type, inputs, outputs, connections) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.x = x;
    this.y = y;
    this.type = type;
    this.inputs = inputs;
    this.outputs = outputs;
    this.connections = connections;
  }

  move(x, y) {
    this.x = x;
    this.y = y;
    this.updated = true;
  }

  addConnection(connection) {
    this.updated = true;
    this.connections.push(connection);
  }

  deleteConnection(connection) {
    this.updated = true;
    this.connections = this.connections.filter(i => !i.equals(connection));
  }

  update() {
    this.updated = false;
  }

  static fromJson(json) {
    const c = new Component();
    c.id = json.id;
    c.name = json.name;
    c.code = json.code;
    c.x = json.x;
    c.y = json.y;
    c.type = json.type;
    c.inputs = json.inputs.map(i => Socket.fromJson(i));
    c.outputs = json.outputs.map(i => Socket.fromJson(i));
    c.connections = json.connectFrom.map(i => Connection.fromJson(i));
    return c;
  }

  toJson() {
    return {
      x: this.x,
      y: this.y,
      id: this.id,
      name: this.name,
      code: this.code,
      type: this.type,
      inputs: this.inputs.map(i => i.toJson()),
      outputs: this.outputs.map(i => i.toJson()),
      connectFrom: this.connections.map(i => i.toJson()),
    };
  }
}
