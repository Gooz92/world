export default class Action {

  constructor(actor, data) {
    this.actor = actor;
    this.completed = false;

    this.data = data;
  }

  perform() {
    this.completed = true;

    return { type: this.type, data: this.data };
  }
}