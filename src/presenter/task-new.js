import TaskEditView from '../view/task-edit';
import {remove, render, PlaceTemplate} from '../utils/render';
import {UserAction, UpdateType} from '../const';

class TaskNew {
  constructor(taskListContainer, changeData) {
    this._taskListContainer = taskListContainer;
    this._changeData = changeData;

    this._taskEditComponent = null;
    this._destroyCallback = null;

    this._handle = {
      formSubmit: this._handleFormSubmit.bind(this),
      deleteClick: this._handleDeleteClick.bind(this),
      escKeyDown: this._escKeyDownHandler.bind(this)
    };
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._taskEditComponent !== null) {
      return;
    }

    this._taskEditComponent = new TaskEditView();
    this._taskEditComponent.setFormSubmitHandler(this._handle.formSubmit);
    this._taskEditComponent.setDeleteClickHandler(this._handle.deleteClick);

    render(this._taskListContainer, this._taskEditComponent, PlaceTemplate.AFTERBEGIN);

    document.addEventListener(`keydown`, this._handle.escKeyDown);
  }

  destroy() {
    if (this._taskEditComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._taskEditComponent);
    this._taskEditComponent = null;

    document.removeEventListener(`keydown`, this._handle.escKeyDown);
  }

  setSaving() {
    this._taskEditComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._taskEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._taskEditComponent.shake(resetFormState);
  }

  _handleFormSubmit(task) {
    this._changeData(
        UserAction.ADD_TASK,
        UpdateType.MINOR,
        task
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}

export default TaskNew;
