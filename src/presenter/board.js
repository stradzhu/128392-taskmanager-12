import {TaskParam, SortType, UpdateType, UserAction, FilterType} from '../const';
import {render, PlaceTemplate, remove} from '../utils/render';
import {sortTaskUp, sortTaskDown} from '../utils/task';
import {filter} from '../utils/filter';

import BoardView from '../view/board';
import SortView from '../view/sort';
import TaskContainerView from '../view/task-container';
import NoTaskView from '../view/no-task';
import LoadMoreView from '../view/load-more';

import TaskPresenter from './task';
import TaskNewPresenter from './task-new';

class Board {
  constructor(boardContainer, tasksModel, filterModel) {
    this._tasksModel = tasksModel;
    this._filterModel = filterModel;
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TaskParam.COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._taskPresenter = {};

    this._sortComponent = null;
    this._loadMoreComponent = null;

    this._boardComponent = new BoardView();
    this._taskContinerComponent = new TaskContainerView();
    this._noTaskComponent = new NoTaskView();

    this._handle = {
      viewAction: this._handleViewAction.bind(this),
      modelEvent: this._handleModelEvent.bind(this),
      modeChange: this._handleModeChange.bind(this),
      loadMoreClick: this._handleLoadMoreClick.bind(this),
      sortTypeChange: this._handleSortTypeChange.bind(this)
    };

    this._tasksModel.addObserver(this._handle.modelEvent);
    this._filterModel.addObserver(this._handle.modelEvent);

    this._taskNewPresenter = new TaskNewPresenter(this._taskContinerComponent, this._handle.viewAction);
  }

  init() {
    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._taskContinerComponent);

    this._renderBoard();
  }

  createTask() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    this._taskNewPresenter.init();
  }

  _getTasks() {
    const filterType = this._filterModel.getFilter();
    const tasks = this._tasksModel.getTasks();
    const filtredTasks = filter[filterType](tasks);

    switch (this._currentSortType) {
      case SortType.DATE_UP:
        return filtredTasks.sort(sortTaskUp);
      case SortType.DATE_DOWN:
        return filtredTasks.sort(sortTaskDown);
    }

    return filtredTasks;
  }

  _handleModeChange() {
    this._taskNewPresenter.destroy();
    Object.values(this._taskPresenter).forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this._tasksModel.updateTask(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this._tasksModel.addTask(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this._tasksModel.deleteTask(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._taskPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard({resetRenderedTaskCount: true});
    this._renderBoard();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      // можно и не делать, это для наглядности
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handle.sortTypeChange);

    render(this._boardComponent, this._sortComponent, PlaceTemplate.AFTERBEGIN);
  }

  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskContinerComponent, this._handle.viewAction, this._handle.modeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
  }

  _renderTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
  }

  _renderNoTasks() {
    // Метод для рендеринга заглушки
    render(this._boardComponent, this._noTaskComponent);
  }

  _handleLoadMoreClick() {
    const taskCount = this._getTasks().length;
    const newRenderedTaskCount = Math.min(taskCount, this._renderedTaskCount + TaskParam.COUNT_PER_STEP);
    const tasks = this._getTasks().slice(this._renderedTaskCount, newRenderedTaskCount);

    this._renderTasks(tasks);
    this._renderedTaskCount = newRenderedTaskCount;

    if (this._renderedTaskCount >= taskCount) {
      remove(this._loadMoreComponent);
    }
  }

  _renderLoadMore() {
    if (this._loadMoreComponent !== null) {
      this._loadMoreComponent = null;
    }

    this._loadMoreComponent = new LoadMoreView();
    this._loadMoreComponent.setClickHandler(this._handle.loadMoreClick);

    render(this._boardComponent, this._loadMoreComponent, PlaceTemplate.BEFOREEND);
  }

  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    const taskCount = this._getTasks().length;

    this._taskNewPresenter.destroy();
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};

    remove(this._sortComponent);
    remove(this._noTaskComponent);
    remove(this._loadMoreComponent);

    if (resetRenderedTaskCount) {
      this._renderedTaskCount = TaskParam.COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this._renderedTaskCount = Math.min(taskCount, this._renderedTaskCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    const tasks = this._getTasks();
    const taskCount = tasks.length;

    if (taskCount === 0) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();

    // Теперь, когда _renderBoard рендерит доску не только на старте,
    // но и по ходу работы приложения, нужно заменить
    // константу TASK_COUNT_PER_STEP на свойство _renderedTaskCount,
    // чтобы в случае перерисовки сохранить N-показанных карточек
    this._renderTasks(tasks.slice(0, Math.min(taskCount, this._renderedTaskCount)));

    if (taskCount > this._renderedTaskCount) {
      this._renderLoadMore();
    }
  }
}

export default Board;
