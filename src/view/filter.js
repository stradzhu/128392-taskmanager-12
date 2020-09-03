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
    this._elements = filters;
    this._current = currentFilterType;

    this._handler = {
      typeChange: this._typeChangeHandler.bind(this)
    };
  }

  getTemplate() {
    return createFilterTemplate(this._elements, this._current);
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.typeChange(evt.target.value);
  }

  setTypeChangeHandler(callback) {
    this._callback.typeChange = callback;
    this.getElement().addEventListener(`change`, this._handler.typeChange);
  }
}

export default Filter;
