import AbstractView from './abstract.js';

const createSortItemTemplate = (type, title) => `<a href="#" class="board__filter" data-sort-type="${type}">${title}</a>`;

const createSortTemplate = (sortItems) => (
  `<div class="board__filter-list">
    ${sortItems.map(({type, title}) => createSortItemTemplate(type, title)).join(``)}
  </div>`
);

class Sort extends AbstractView {
  constructor(sortItems) {
    super();
    this._sortItems = sortItems;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._sortItems);
  }

  _sortTypeChangeHandler(evt) {
    let sortType = evt.target.dataset.sortType;
    if (!sortType) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}

export default Sort;
