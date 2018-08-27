export default function step(world) {

  return world.objects
    .map(object => object.act())
    .filter(action => action.type !== 'IDLE');
}
