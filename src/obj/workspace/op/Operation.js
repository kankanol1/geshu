export default class Operation {
  constructor() {
    if (this.constructor === Operation) {
      throw new TypeError('cannot construct operation directly');
    }
    if (this.do === undefined || this.undo === undefined) {
      throw new TypeError('must override methods: <do> and <undo>');
    }
  }
}
