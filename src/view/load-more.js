import {createElement} from '../utils.js';

const createLoadMoreTemplate = () => `<button class="load-more" type="button">load more</button>`;

export default class LoadMore {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createLoadMoreTemplate();
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
