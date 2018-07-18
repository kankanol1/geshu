import Operation from './Operation';

export default class CanvasMove extends Operation {
  x;
  y;
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }

  do(canvas) {
    this.originOffset = canvas.offset;
    canvas.setOffset(this.x, this.y);
  }

  undo(canvas) {
    canvas.setOffset(this.originOffset.x, this.originOffset.y);
  }
}
