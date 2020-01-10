export default class Inventory {

  constructor(capacity) {
    this.$capacity = capacity;

    this.$storedAmount = 0;
    this.$items = new Map();
  }

  getAvailableCapacity() {
    return this.$capacity - this.$storedAmount;
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

    this.$storedAmount += addedAmount;
    return addedAmount;
  }

  asArray() {
    return Array.from(this.$items.entries());
  }

  remove(itemType) {
    this.$storedAmount -= this.getAmount(itemType);
    return this.$items.delete(itemType.id);
  }
}
