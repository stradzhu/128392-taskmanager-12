import AbstractView from './abstract';
import {MenuItem} from '../const';

const createMenuTemplate = () => (
  `<section class="main__control control container">
    <h1 class="control__title">TASKMANAGER</h1>
    <section class="control__btn-wrap">
      <input type="radio" name="control" id="control__new-task" class="control__input visually-hidden" value="${MenuItem.ADD_NEW_TASK}">
      <label for="control__new-task" class="control__label control__label--new-task">+ ADD NEW TASK</label>
      <input type="radio" name="control" id="control__task" class="control__input visually-hidden" value="${MenuItem.TASKS}" checked>
      <label for="control__task" class="control__label">TASKS</label>
      <input type="radio" name="control" id="control__statistic" class="control__input visually-hidden" value="${MenuItem.STATISTICS}">
      <label for="control__statistic" class="control__label">STATISTICS</label>
    </section>
  </section>`
);

class Menu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.value);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`change`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[value=${menuItem}]`);

    if (item !== null) {
      item.checked = true;
    }
  }
}

export default Menu;
