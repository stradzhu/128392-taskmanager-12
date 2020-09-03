import Observer from '../utils/observer';
import {FilterType} from '../const.js';

class Filter extends Observer {
  constructor() {
    super();
    this._active = FilterType.ALL;
  }

  set(updateType, filter) {
    this._active = filter;
    this._notify(updateType, filter);
  }

  get() {
    return this._active;
  }
}

export default Filter;
