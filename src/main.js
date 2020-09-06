import {TaskParam, MenuItem, UpdateType, FilterType} from './const';
import {PlaceTemplate, render, remove} from './utils/render';

import MenuView from './view/menu';
import StatisticsView from './view/statistics';

import {generateTask} from './mock/task';

import BoardPresenter from './presenter/board';
import FilterPresenter from './presenter/filter';

import TasksModel from './model/tasks';
import FilterModel from "./model/filter.js";

const tasks = new Array(TaskParam.COUNT).fill().map(generateTask);

const tasksModel = new TasksModel();
tasksModel.updateElements = tasks;

const filterModel = new FilterModel();

const mainElement = document.querySelector(`.main`);
const menuComponent = new MenuView();

const handleTaskNewFormClose = () => {
  menuComponent.setMenuItem(MenuItem.TASKS);
};

let statisticsComponent;

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_TASK:
      remove(statisticsComponent);
      boardPresenter.destroy();
      filterModel.set(UpdateType.MAJOR, FilterType.ALL);
      boardPresenter.init();
      boardPresenter.createTask(handleTaskNewFormClose);
      break;
    case MenuItem.TASKS:
      boardPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      boardPresenter.destroy();
      statisticsComponent = new StatisticsView(tasksModel.getElements);
      render(mainElement, statisticsComponent, PlaceTemplate.BEFOREEND);
      break;
  }
};

menuComponent.setMenuClickHandler(handleMenuClick);

render(mainElement, menuComponent);

const boardPresenter = new BoardPresenter(mainElement, tasksModel, filterModel);
new FilterPresenter(mainElement, filterModel, tasksModel).init();
boardPresenter.init();
