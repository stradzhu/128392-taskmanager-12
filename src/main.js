import {TaskParam} from './const';
import {render} from './utils/render';

import MenuView from './view/menu';

import {generateTask} from './mock/task';

import BoardPresenter from './presenter/board';
import FilterPresenter from './presenter/filter';

import TasksModel from './model/tasks';
import FilterModel from "./model/filter.js";

const tasks = new Array(TaskParam.COUNT).fill().map(generateTask);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterModel = new FilterModel();

const mainElement = document.querySelector(`.main`);

render(mainElement, new MenuView());

const boardPresenter = new BoardPresenter(mainElement, tasksModel, filterModel);
new FilterPresenter(mainElement, filterModel, tasksModel).init();

boardPresenter.init();

document.querySelector(`#control__new-task`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  boardPresenter.createTask();
});
