import UntrackedOperation from './UntrackedOperation';

export default class ScaleChange extends UntrackedOperation {
  scale;
  constructor(newScale) {
    super();
    this.scale = newScale;
  }

  do(canvas) {
    this.originScale = canvas.scale;
    canvas.setScale(this.scale);
  }

  undo(canvas) {
    canvas.setScale(this.originScale);
  }
}
