export class BaseManager {
  constructor(storageKey) {
    this.storageKey = storageKey;
    this.data = this.loadData();
  }

  saveData(data = null) {
    if (data) {
      this.data = data; // overwrite if provided
    }
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  loadData() {
    const savedData = localStorage.getItem(this.storageKey);
    return savedData ? JSON.parse(savedData) : [];
  }

  add(item) {
    this.data.push(item);
    this.saveData();
  }

  // Update item by id
  update(id, updatedItem) {
    const index = this.data.findIndex(item => item.id === id);
    if (index !== -1) {
      this.data[index] = updatedItem;
      this.saveData();
    }
  }

  // Delete item by id
  delete(id) {
    this.data = this.data.filter(item => item.id !== id);
    this.saveData();
  }

  // Get all items
  getAll() {
    return this.data;
  }
}
