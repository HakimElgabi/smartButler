class Butler {
  constructor() {
    this.currentAction = null;
    this.targetRoom = null;
    this.inventory = [];
  }

  /**
   * Sets the target room of the butler
   *
   * @param {number} roomId ID of room to go to
   *
   * @returns {number} ID of room that the butler is going to
   */
  goToRoom(roomId) {
    this.targetRoom = roomId;
    return this.targetRoom;
  }

  /**
   * Add an item to the butler's inventory
   *
   * @param {string} item
   *
   * @returns {Array} Butler's new inventory
   */
  pickUp(item) {
    this.inventory.push(item);
    return this.inventory;
  }

  /**
   * Drops off a SINGLE item from the butler's inventory
   *
   * @param {string} item Name of item to drop off
   *
   * @returns {Array} Butler's new inventory
   */
  dropOff(item) {
    let itemFound = false;
    this.inventory = this.inventory.filter((iItem) => {
      if (itemFound == false && iItem.toLowerCase() == item.toLowerCase()) {
        itemFound = true;
        return false;
      }
      return true;
    });

    return this.inventory;
  }
}

module.exports = Butler;
