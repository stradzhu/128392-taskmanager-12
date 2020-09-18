import {MenuItem, UpdateType, FilterType} from './const';
import {PlaceTemplate, render, remove} from './utils/render';
import MenuView from './view/menu';
import StatisticsView from './view/statistics';
import BoardPresenter from './presenter/board';
import FilterPresenter from './presenter/filter';
import TasksModel from './model/tasks';
import FilterModel from "./model/filter.js";
import Api from './api';

const AUTHORIZATION = `Basic Stanislav-Privet!`;
const END_POINT = `https://12.ecmascript.pages.academy/task-manager`;

const api = new Api(END_POINT, AUTHORIZATION);

const tasksModel = new TasksModel();
const filterModel = new FilterModel();

const mainElement = document.querySelector(`.main`);
const menuComponent = new MenuView();

const handleTaskNewFormClose = () => {
  menuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = false;
  menuComponent.setMenuItem(MenuItem.TASKS);
};

let statisticsComponent = null;

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
      render(mainElement, statisticsComponent);
      break;
  }
};

const boardPresenter = new BoardPresenter(mainElement, tasksModel, filterModel, api);
new FilterPresenter(mainElement, filterModel, tasksModel).init();
boardPresenter.init();

api.getTasks()
  .then((tasks) => {
    tasksModel.updateElements = {updateType: UpdateType.INIT, tasks};
  })
  .catch(() => {
    tasksModel.updateElements = {updateType: UpdateType.INIT, tasks: []};
  })
  .finally(()=>{
    render(mainElement, menuComponent, PlaceTemplate.AFTERBEGIN);
    menuComponent.setMenuClickHandler(handleMenuClick);
  });
