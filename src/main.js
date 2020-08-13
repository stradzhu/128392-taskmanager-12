import {getRandomInteger, render} from './utils.js';

import MenuView from './view/menu.js';
import FilterView from './view/filter.js';
import BoardView from './view/board.js';
import SortView from './view/sort.js';
import TaskContainerView from './view/task-container.js';
import TaskItemView from './view/task-item.js';
import TaskEditView from './view/task-edit.js';
import NoTaskView from './view/no-task.js';
import LoadMoreView from './view/load-more.js';

import {generateTask} from './mock/task.js';
import {generateFilter} from './mock/filter.js';
import {generateSort} from './mock/sort.js';

const TaskParam = {
  COUNT: getRandomInteger(15, 25),
  COUNT_PER_STEP: 8
};

const tasks = new Array(TaskParam.COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const renderTask = (taskContainerElement, task) => {
  const taskItemComponent = new TaskItemView(task);
  const taskEditComponent = new TaskEditView(task);

  const replaceCardToForm = () => {
    taskContainerElement.replaceChild(taskEditComponent.getElement(), taskItemComponent.getElement());
  };

  const replaceFormToCard = () => {
    taskContainerElement.replaceChild(taskItemComponent.getElement(), taskEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskItemComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskContainerElement, taskItemComponent.getElement());
};

const renderBoard = (boardContainer, boardTasks) => {
  const boardComponent = new BoardView();
  const taskContainerComponent = new TaskContainerView();

  render(boardContainer, boardComponent.getElement());

  //  на пустом массиве метод every возвращает true
  if (boardTasks.every((task) => task.isArchive)) {
    render(boardComponent.getElement(), new NoTaskView().getElement());
    return;
  }

  render(boardComponent.getElement(), new SortView(generateSort()).getElement());

  render(boardComponent.getElement(), taskContainerComponent.getElement());

  boardTasks
    .slice(0, Math.min(boardTasks.length, TaskParam.COUNT_PER_STEP))
    .forEach((task) => renderTask(taskContainerComponent.getElement(), task));

  if (boardTasks.length > TaskParam.COUNT_PER_STEP) {
    let renderedTaskCount = TaskParam.COUNT_PER_STEP;

    const loadMoreComponent = new LoadMoreView();

    render(boardComponent.getElement(), loadMoreComponent.getElement());

    const loadMoreTask = (evt) => {
      evt.preventDefault();
      boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TaskParam.COUNT_PER_STEP)
        .forEach((task) => renderTask(taskContainerComponent.getElement(), task));

      renderedTaskCount += TaskParam.COUNT_PER_STEP;

      if (renderedTaskCount >= boardTasks.length) {
        loadMoreComponent.getElement().remove();
        loadMoreComponent.removeElement();
      }
    };

    loadMoreComponent.getElement().addEventListener(`click`, loadMoreTask);
  }
};

const mainElement = document.querySelector(`.main`);

render(mainElement, new MenuView().getElement());
render(mainElement, new FilterView(filters).getElement());

renderBoard(mainElement, tasks);
