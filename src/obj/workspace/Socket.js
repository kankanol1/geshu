export default class Socket {
  hint;
  x;
  y;
  id;
  label;
  connects;
  type;

  static fromJson(json) {
    const s = new Socket();
    s.hint = json.hint;
    s.x = json.x;
    s.y = json.y;
    s.id = json.id;
    s.label = json.label;
    s.connects = json.connects;
    s.type = json.type;
    return s;
  }

  toJson() {
    return {
      hint: this.hint,
      x: this.x,
      y: this.y,
      id: this.id,
      label: this.label,
      connects: this.connects,
      type: this.type,
    };
  }
}
