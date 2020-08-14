import {getRandomInteger, render, replaceElement} from './utils.js';

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

const ESCAPE_KEY_CODE = 27;

const tasks = new Array(TaskParam.COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const renderTask = (taskContainerElement, task) => {
  const taskItemElement = new TaskItemView(task).getElement();
  const taskEditElement = new TaskEditView(task).getElement();

  const onEscKeyDown = (evt) => {
    if (evt.keyCode === ESCAPE_KEY_CODE) {
      evt.preventDefault();
      replaceElement(taskContainerElement, taskItemElement, taskEditElement);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskItemElement.querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceElement(taskContainerElement, taskEditElement, taskItemElement);
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditElement.querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceElement(taskContainerElement, taskItemElement, taskEditElement);
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskContainerElement, taskItemElement);
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
