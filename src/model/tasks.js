import Observer from '../utils/observer';

class Tasks extends Observer {
  constructor() {
    super();
    this._tasks = [];
  }

  // Еле привык к сеттеру, а теперь привыкать к объектам в параметрах функции :)
  // неудобно так(( нужно следить, как называются переменные при их передаче сюда
  set updateElements({updateType, tasks}) {
    this._tasks = tasks.slice();
    this._notify(updateType);
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

  static adaptToClient(task) {
    const adaptedTask = Object.assign(
        {},
        task,
        {
          dueDate: task.due_date !== null ? new Date(task.due_date) : task.due_date, // На клиенте дата хранится как экземпляр Date
          isArchive: task.is_archived,
          isFavorite: task.is_favorite,
          repeating: task.repeating_days
        }
    );

    // Ненужные ключи мы удаляем
    delete adaptedTask.due_date;
    delete adaptedTask.is_archived;
    delete adaptedTask.is_favorite;
    delete adaptedTask.repeating_days;

    return adaptedTask;
  }

  static adaptToServer(task) {
    const adaptedTask = Object.assign(
        {},
        task,
        {
          "due_date": task.dueDate instanceof Date ? task.dueDate.toISOString() : null, // На сервере дата хранится в ISO формате
          "is_archived": task.isArchive,
          "is_favorite": task.isFavorite,
          "repeating_days": task.repeating
        }
    );

    // Ненужные ключи мы удаляем
    delete adaptedTask.dueDate;
    delete adaptedTask.isArchive;
    delete adaptedTask.isFavorite;
    delete adaptedTask.repeating;

    return adaptedTask;
  }
}

export default Tasks;
