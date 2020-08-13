import {createElement} from '../utils.js';

const createTaskContainerTemplate = () => `<div class="board__tasks"></div>`;

export default class TaskContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTaskContainerTemplate();
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
