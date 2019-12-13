import createEnum from 'utils/common/create-enum.js';

const ObjectType = createEnum(
  function(id, name) {
    this.id = id;
    this.name = name.toLowerCase();
  },
  {
    OBSTACLE: [ 1 ],
    TREE: [ 2 ],
    PERSON: [ 3 ],
    STOCK: [ 4 ],
    FOOD: [ 5 ],
    BUILDING: [ 6 ]
  }
);

ObjectType.fromId = id => (
  ObjectType.members.find(type => type.id === id)
);

export default ObjectType;
