const createFilterItemTemplate = (filter, isChecked) => {
  const {name, count} = filter;

  return `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? `checked` : ``}
      ${count === 0 ? `disabled` : ``}>
    <label for="filter__${name}" class="filter__label">
      ${name} <span class="filter__${name}-count">${count}</span>
    </label>`;
};

const createFilterTemplate = (filterItems) => (
  `<section class="main__filter filter container">
    ${filterItems.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join(``)}
  </section>`
);

export {createFilterTemplate};
