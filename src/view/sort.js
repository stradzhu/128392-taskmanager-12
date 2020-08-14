import {createElement} from '../utils.js';

const createSortItemTemplate = (title) => `<a href="#" class="board__filter">${title}</a>`;

const createSortTemplate = (sortItems) => (
  `<div class="board__filter-list">
    ${sortItems.map((title) => createSortItemTemplate(title)).join(``)}
  </div>`
);

class Sort {
  constructor(sortItems) {
    this._sortItems = sortItems;
    this._element = null;
  }

  getTemplate() {
    return createSortTemplate(this._sortItems);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default Sort;
