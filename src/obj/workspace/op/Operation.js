export default class Operation {
  constructor() {
    if (new.target === Operation) {
      throw new TypeError('cannot construct operation directly');
    }
    if (this.do === undefined || this.undo === undefined) {
      throw new TypeError('must override methods: <do> and <undo>');
    }
  }
}
