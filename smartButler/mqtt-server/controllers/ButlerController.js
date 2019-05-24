const Butler = require("../models/Butler");

class ButlerController {
  constructor() {
    this.butlers = [];
    this.newButler();
    this.newButler();
  }

  newButler() {
    this.butlers.push(new Butler());
  }
}

module.exports = ButlerController;
