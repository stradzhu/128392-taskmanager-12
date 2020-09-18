import FilterView from '../view/filter';
import {render, PlaceTemplate, replace, remove} from '../utils/render';
import {filter} from '../utils/filter';
import {FilterType, UpdateType} from '../const';

class Filter {
  constructor(filterContainer, filterModel, tasksModel) {
    this._container = filterContainer;
    this._model = filterModel;
    this._tasksModel = tasksModel;
    this._current = null;

    this._component = null;

    this._handle = {
      modelEvent: this._handleModelEvent.bind(this),
      typeChange: this._handleTypeChange.bind(this)
    };

    this._tasksModel.addObserver(this._handle.modelEvent);
    this._model.addObserver(this._handle.modelEvent);
  }

  init() {
    this._current = this._model.get();

    const filters = this._get();
    const prevComponent = this._component;

    this._component = new FilterView(filters, this._current);
    this._component.setTypeChangeHandler(this._handle.typeChange);

    if (!prevComponent) {
      render(this._container, this._component, PlaceTemplate.BEFOREEND);
      return;
    }

    replace(this._component, prevComponent);
    remove(prevComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleTypeChange(filterType) {
    if (this._current === filterType) {
      return;
    }

    this._model.set(UpdateType.MAJOR, filterType);
  }

  _get() {
    const tasks = this._tasksModel.getElements;
    return Object.values(FilterType).map((title) => ({
      type: title,
      name: title.charAt(0).toUpperCase() + title.slice(1), // если принципиально, чтобы первая буква была большая
      count: filter[title](tasks).length
    }));
  }
}

export default Filter;
