import AbstractView from './abstract';

const createFilterItemTemplate = ({type, name, count}, currentFilterType) => (
  `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      value="${type}"
      ${type === currentFilterType ? `checked` : ``}
      ${count === 0 ? `disabled` : ``}>
    <label for="filter__${name}" class="filter__label">
      ${name} <span class="filter__${name}-count">${count}</span>
    </label>`
);

const createFilterTemplate = (filterItems, currentFilterType) => (
  `<section class="main__filter filter container">
    ${filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join(``)}
  </section>`
);

class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._handler = {
      filterTypeChange: this._filterTypeChangeHandler.bind(this)
    };
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._handler.filterTypeChange);
  }
}

export default Filter;
