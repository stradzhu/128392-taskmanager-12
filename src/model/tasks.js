import Observer from '../utils/observer';

class Tasks extends Observer {
  constructor() {
    super();
    this._tasks = [];
  }

  set updateElements(tasks) {
    this._tasks = tasks.slice();
  }

  get getElements() {
    return this._tasks;
  }

  updateElement(updateType, update) {
    const index = this._tasks.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._tasks = [
      ...this._tasks.slice(0, index),
      update,
      ...this._tasks.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addElement(updateType, update) {
    this._tasks = [
      update,
      ...this._tasks
    ];

    this._notify(updateType, update);
  }

  deleteElement(updateType, update) {
    const index = this._tasks.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._tasks = [
      ...this._tasks.slice(0, index),
      ...this._tasks.slice(index + 1)
    ];

    this._notify(updateType);
  }
}

export default Tasks;
