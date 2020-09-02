import {TaskParam} from './const';
import {render} from './utils/render';

import MenuView from './view/menu';
import FilterView from './view/filter';

import {generateTask} from './mock/task';
import {generateFilter} from './mock/filter';

import BoardPresenter from './presenter/board';

const tasks = new Array(TaskParam.COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const mainElement = document.querySelector(`.main`);

render(mainElement, new MenuView());
render(mainElement, new FilterView(filters));

new BoardPresenter(mainElement).init(tasks);
