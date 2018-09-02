export default class Action {

  constructor(actor, data) {
    this.actor = actor;
    this.completed = false;

    this.data = data;
  }

  perform() {
    this.completed = true;

    // TODO this.constructor.type is bad (
    return { type: this.type || this.constructor.type, data: this.data };
  }
}