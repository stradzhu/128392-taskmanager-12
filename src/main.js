import {TASK_COUNT, TASK_COUNT_PER_STEP, PlaceTemplate} from './const.js';

import {createMenuTemplate} from './view/menu.js';
import {createFilterTemplate} from './view/filter.js';
import {createBoardTemplate} from './view/board.js';
import {createSortItemTemplate} from './view/sort-item.js';
import {createTaskTemplate} from './view/task.js';
import {createTaskEditTemplate} from './view/task-edit.js';
import {createLoadMoreTemplate} from './view/load-more.js';

import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const render = (container, template, place = PlaceTemplate.BEFOREEND) => {
  container.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector(`.main`);

render(mainElement, createMenuTemplate());
render(mainElement, createFilterTemplate(filters));
render(mainElement, createBoardTemplate());

const boardElement = mainElement.querySelector(`.board`);
const sortElement = boardElement.querySelector(`.board__filter-list`);
const tasksElement = boardElement.querySelector(`.board__tasks`);

render(sortElement, createSortItemTemplate());
render(sortElement, createSortItemTemplate());
render(sortElement, createSortItemTemplate());

render(tasksElement, createTaskEditTemplate(tasks[0]));

for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  render(tasksElement, createTaskTemplate(tasks[i]));
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;

  render(boardElement, createLoadMoreTemplate());

  const loadMoreButton = boardElement.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => render(tasksElement, createTaskTemplate(task)));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButton.remove();
    }
  });
}

