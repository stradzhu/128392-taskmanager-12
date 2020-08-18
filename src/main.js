import {TaskParam} from './const.js';
import {render} from './utils/render.js';

import MenuView from './view/menu.js';
import FilterView from './view/filter.js';

import {generateTask} from './mock/task.js';
import {generateFilter} from './mock/filter.js';

import BoardPresenter from './presenter/board.js';

const tasks = new Array(TaskParam.COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const mainElement = document.querySelector(`.main`);

render(mainElement, new MenuView());
render(mainElement, new FilterView(filters));

new BoardPresenter(mainElement).init(tasks);
