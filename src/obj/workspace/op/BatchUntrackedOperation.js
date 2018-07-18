import UntrackedOperation from './UntrackedOperation';

export default class BatchUntrackedOperation extends UntrackedOperation {
  componentMoves;
  constructor(componentMoves) {
    super();
    this.componentMoves = componentMoves;
  }

  do(canvas) {
    this.componentMoves.forEach(i => i.do(canvas));
  }

  undo(canvas) {
    this.componentMoves.forEach(i => i.undo(canvas));
  }
}
