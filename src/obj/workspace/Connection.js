export default class Connection {
  component;
  from;
  to;

  constructor(component, from, to) {
    this.component = component;
    this.from = from;
    this.to = to;
  }

  equals(that) {
    return this.component === that.component &&
      this.from === that.from && this.to === that.to;
  }

  static fromJson(json) {
    const c = new Connection();
    c.component = json.component;
    c.from = json.from;
    c.to = json.to;
    return c;
  }

  toJson() {
    return {
      component: this.component,
      from: this.from,
      to: this.to,
    };
  }
}
