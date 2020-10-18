import createEnum from 'utils/create-enum.js';

const ResourceType = createEnum(
  function(id, name) {
    this.id = id;
    this.name = name.toLowerCase();
  },
  {
    WOOD: [ 1 ],
    FOOD: [ 2 ]
  }
);

ResourceType.fromId = id => (
  ResourceType.members.find(type => type.id === id)
);

export default ResourceType;
