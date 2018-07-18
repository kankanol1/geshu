import Operation from './Operation';

export default class BatchOperation extends Operation {
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
