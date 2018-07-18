import Operation from './Operation';

export default class SelectionChange extends Operation {
  selection;
  constructor(selection) {
    super();
    this.selection = selection;
  }

  do(canvas) {
    this.originSelection = canvas.selection;
    canvas.setSelection(this.selection);
  }

  undo(canvas) {
    canvas.setSelection(this.originSelection);
  }
}
