import {createMenuTemplate} from './view/menu.js';
import {createFilterTemplate} from './view/filter.js';
import {createBoardTemplate} from './view/board.js';
import {createSortItemTemplate} from './view/sort-item.js';
import {createTaskTemplate} from './view/task.js';
import {createEditTaskTemplate} from './view/edit-task.js';
import {createLoadMoreTemplate} from './view/load-more.js';

const PlaceTemplate = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

const render = (container, template, place = PlaceTemplate.BEFOREEND) => {
  container.insertAdjacentHTML(place, template);
};

const main = document.querySelector(`.main`);

render(main, createMenuTemplate());
render(main, createFilterTemplate());
render(main, createBoardTemplate());

const board = main.querySelector(`.board`);
const sort = board.querySelector(`.board__filter-list`);
const tasks = board.querySelector(`.board__tasks`);

render(sort, createSortItemTemplate());
render(sort, createSortItemTemplate());
render(sort, createSortItemTemplate());

render(tasks, createEditTaskTemplate());

render(tasks, createTaskTemplate());
render(tasks, createTaskTemplate());
render(tasks, createTaskTemplate());

render(board, createLoadMoreTemplate());
