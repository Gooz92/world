export default class Inventory {

  constructor(maxCapacity) {
    this.$maxCapacity = maxCapacity;

    this.$capacity = 0;
    this.$items = new Map();
  }

  getAvailableCapacity() {
    return this.$maxCapacity - this.$capacity;
  }

  contains(itemType) {
    return this.$items.has(itemType.id);
  }

  getAmount(itemType) {
    if (this.contains(itemType)) {
      return this.$items.get(itemType.id);
    }

    return 0;
  }

  add(itemType, amount) {
    const availableCapacity = this.getAvailableCapacity();
    const addedAmount = amount < availableCapacity ? amount : availableCapacity;

    const previousAmount = this.getAmount(itemType);
    const newAmount = previousAmount + addedAmount;

    this.$items.set(itemType.id, newAmount);

    this.$capacity += addedAmount;
    return addedAmount;
  }

  asArray() {
    return Array.from(this.$items.entries());
  }

  remove(itemType) {
    return this.$items.delete(itemType.id);
  }
}
