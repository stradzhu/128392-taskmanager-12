import {TaskParam, SortType} from '../const';
import {render, PlaceTemplate, remove} from '../utils/render';
import {sortTaskUp, sortTaskDown} from '../utils/task';
import {updateItem} from '../utils/common';

import BoardView from '../view/board';
import SortView from '../view/sort';
import TaskContainerView from '../view/task-container';
import NoTaskView from '../view/no-task';
import LoadMoreView from '../view/load-more';

import TaskPresenter from './task';

class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TaskParam.COUNT_PER_STEP;
    this._currentSortType = SortType[0].type;
    this._taskPresenter = {};

    this._boardComponent = new BoardView();
    this._sortComponent = new SortView(SortType);
    this._taskContinerComponent = new TaskContainerView();
    this._noTaskComponent = new NoTaskView();
    this._loadMoreComponent = new LoadMoreView();

    this._handle = {
      taskChange: this._handleTaskChange.bind(this),
      modeChange: this._handleModeChange.bind(this),
      loadMoreClick: this._handleLoadMoreClick.bind(this),
      sortTypeChange: this._handleSortTypeChange.bind(this)
    };
  }

  init(boardTasks) {
    // Метод для инициализации (начала работы) модуля,
    // малая часть текущей функции renderBoard в main.js
    this._boardTasks = boardTasks.slice();
    this._sourcedBoardTasks = boardTasks.slice();

    render(this._boardContainer, this._boardComponent);

    this._renderBoard();
  }

  _handleModeChange() {
    Object.values(this._taskPresenter).forEach((presenter) => presenter.resetView());
  }

  _handleTaskChange(updatedTask) {
    this._boardTasks = updateItem(this._boardTasks, updatedTask);
    this._sourcedBoardTasks = updateItem(this._sourcedBoardTasks, updatedTask);
    this._taskPresenter[updatedTask.id].init(updatedTask);
  }

  _sortTasks(sortType) {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks
    switch (sortType) {
      case SortType[1].type:
        this._boardTasks.sort(sortTaskUp);
        break;
      case SortType[2].type:
        this._boardTasks.sort(sortTaskDown);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this._boardTasks = this._sourcedBoardTasks.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortTasks(sortType);
    this._clearTaskList();
    this._renderTaskList();
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    render(this._boardComponent, this._sortComponent, PlaceTemplate.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handle.sortTypeChange);
  }

  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskContinerComponent, this._handle.taskChange, this._handle.modeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
  }

  _renderTasks(from, to) {
    // Метод для рендеринга N-задач за раз
    this._boardTasks
      .slice(from, to)
      .forEach((task) => this._renderTask(task));
  }

  _renderNoTasks() {
    // Метод для рендеринга заглушки
    render(this._boardComponent, this._noTaskComponent);
  }

  _handleLoadMoreClick() {
    this._renderTasks(this._renderedTaskCount, this._renderedTaskCount + TaskParam.COUNT_PER_STEP);
    this._renderedTaskCount += TaskParam.COUNT_PER_STEP;

    if (this._renderedTaskCount >= this._boardTasks.length) {
      remove(this._loadMoreComponent);
    }
  }

  _renderLoadMore() {
    // Метод, куда уйдёт логика по отрисовке компонетов задачи,
    // текущая функция renderTask в main.js
    render(this._boardComponent, this._loadMoreComponent);
    this._loadMoreComponent.setClickHandler(this._handle.loadMoreClick);
  }

  _clearTaskList() {
    Object.values(this._taskPresenter).forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};
    this._renderedTaskCount = TaskParam.COUNT_PER_STEP;
  }

  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, TaskParam.COUNT_PER_STEP));

    if (this._boardTasks.length > TaskParam.COUNT_PER_STEP) {
      this._renderLoadMore();
    }
  }

  _renderBoard() {
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderBoard в main.js
    // на пустом массиве метод every возвращает true
    if (this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    render(this._boardComponent, this._taskContinerComponent);
    this._renderSort();
    this._renderTaskList();
  }
}

export default Board;
