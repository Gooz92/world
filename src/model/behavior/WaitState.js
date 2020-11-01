import State from './State';

export default class WaitState extends State.IDLE {

  constructor(actor, { isDone }) {
    super(actor);
    this.isDone = isDone;
  }
}
