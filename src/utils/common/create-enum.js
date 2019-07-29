import { forIn } from './object.utils.js';

export default function createEnum(constructor, meta) {

  debugger;
  let init = false;
  const members = [];

  const $Enum = class {
    constructor(...args) {
      if (init) {
        throw 'Enum already created';
      }

      constructor.apply(this, args);
    }

    static get members() {
      return members;
    }
  };

  forIn(meta, (entry, key) => {
    const member = new $Enum(...entry, key);
    $Enum[key] = member;
    members.push(member);
  });

  init = true;

  return $Enum;
}
