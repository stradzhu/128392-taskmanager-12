import {ESCAPE_KEY_CODE} from "../const";
import {render, replace, remove} from "../utils/render";

import TaskItemView from '../view/task-item';
import TaskEditView from '../view/task-edit';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

class Task {
  constructor(taskListContainer, changeData, changeMode) {
    this._listContainer = taskListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._itemComponent = null;
    this._editComponent = null;
    this._mode = Mode.DEFAULT;

    this._handle = {
      editClick: this._handleEditClick.bind(this),
      favoriteClick: this._handleFavoriteClick.bind(this),
      archiveClick: this._handleArchiveClick.bind(this),
      formSubmit: this._handleFormSubmit.bind(this),
      escKeyDown: this._escKeyDownHandler.bind(this)
    };
  }

  init(task) {
    this._task = task;

    const prevTaskItemComponent = this._itemComponent;
    const prevTaskEditComponent = this._editComponent;

    this._itemComponent = new TaskItemView(task);
    this._editComponent = new TaskEditView(task);

    this._itemComponent.setEditClickHandler(this._handle.editClick);
    this._itemComponent.setFavoriteClickHandler(this._handle.favoriteClick);
    this._itemComponent.setArchiveClickHandler(this._handle.archiveClick);
    this._editComponent.setFormSubmitHandler(this._handle.formSubmit);

    if (!prevTaskItemComponent || !prevTaskEditComponent) {
      render(this._listContainer, this._itemComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._itemComponent, prevTaskItemComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editComponent, prevTaskEditComponent);
    }

    remove(prevTaskItemComponent);
    remove(prevTaskEditComponent);
  }

  destroy() {
    remove(this._itemComponent);
    remove(this._editComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceCardToForm() {
    replace(this._editComponent, this._itemComponent);
    document.addEventListener(`keydown`, this._handle.escKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._itemComponent, this._editComponent);
    document.removeEventListener(`keydown`, this._handle.escKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.keyCode === ESCAPE_KEY_CODE) {
      evt.preventDefault();
      this._editComponent.reset(this._task);
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._task,
            {
              isFavorite: !this._task.isFavorite
            }
        )
    );
  }

  _handleArchiveClick() {
    this._changeData(
        Object.assign(
            {},
            this._task,
            {
              isArchive: !this._task.isArchive
            }
        )
    );
  }

  _handleFormSubmit(task) {
    this._changeData(task);
    this._replaceFormToCard();
  }

}

export default Task;
