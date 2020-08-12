import {getRandomInteger, renderTemplate} from './utils.js';

import {createMenuTemplate} from './view/menu.js';
import {createFilterTemplate} from './view/filter.js';
import {createBoardTemplate} from './view/board.js';
import {createSortItemTemplate} from './view/sort-item.js';
import {createTaskTemplate} from './view/task.js';
import {createTaskEditTemplate} from './view/task-edit.js';
import {createLoadMoreTemplate} from './view/load-more.js';

import {generateTask} from './mock/task.js';
import {generateFilter} from './mock/filter.js';

const Task = {
  COUNT: getRandomInteger(15, 25),
  COUNT_PER_STEP: 8
};

const tasks = new Array(Task.COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const mainElement = document.querySelector(`.main`);

renderTemplate(mainElement, createMenuTemplate());
renderTemplate(mainElement, createFilterTemplate(filters));
renderTemplate(mainElement, createBoardTemplate());

const boardElement = mainElement.querySelector(`.board`);
const sortElement = boardElement.querySelector(`.board__filter-list`);
const tasksElement = boardElement.querySelector(`.board__tasks`);

renderTemplate(sortElement, createSortItemTemplate());
renderTemplate(sortElement, createSortItemTemplate());
renderTemplate(sortElement, createSortItemTemplate());

renderTemplate(tasksElement, createTaskEditTemplate(tasks[0]));

for (let i = 1; i < Math.min(tasks.length, Task.COUNT_PER_STEP); i++) {
  renderTemplate(tasksElement, createTaskTemplate(tasks[i]));
}

if (tasks.length > Task.COUNT_PER_STEP) {
  let renderedTaskCount = Task.COUNT_PER_STEP;

  renderTemplate(boardElement, createLoadMoreTemplate());

  const loadMoreButton = boardElement.querySelector(`.load-more`);

  const loadMoreTask = (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedTaskCount, renderedTaskCount + Task.COUNT_PER_STEP)
      .forEach((task) => renderTemplate(tasksElement, createTaskTemplate(task)));

    renderedTaskCount += Task.COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButton.remove();
    }
  };

  loadMoreButton.addEventListener(`click`, loadMoreTask);
}
