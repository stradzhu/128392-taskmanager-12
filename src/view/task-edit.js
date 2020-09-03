import {COLORS} from '../const';
import {isTaskRepeating, formatTaskDueDate} from '../utils/task';
import SmartView from './smart';
import he from 'he';

import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const BLANK_TASK = {
  color: COLORS[0],
  description: ``,
  dueDate: null,
  repeating: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false
  }
};

const createTaskEditDateTemplate = (dueDate, isDueDate) => (
  `<button class="card__date-deadline-toggle" type="button">
    date: <span class="card__date-status">${isDueDate ? `yes` : `no`}</span>
  </button>

  ${isDueDate ? `<fieldset class="card__date-deadline">
    <label class="card__input-deadline-wrap">
      <input
        class="card__date"
        type="text"
        placeholder=""
        name="date"
        value="${formatTaskDueDate(dueDate)}">
    </label>
  </fieldset>` : ``}`
);

const createTaskEditRepeatingTemplate = (repeating, isRepeating) => (
  `<button class="card__repeat-toggle" type="button">
    repeat:<span class="card__repeat-status">${isRepeating ? `yes` : `no`}</span>
  </button>

  ${isRepeating ? `<fieldset class="card__repeat-days">
    <div class="card__repeat-days-inner">
      ${Object.entries(repeating).map(([day, repeat]) => `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}"
        name="repeat"
        value="${day}"
        ${repeat ? `checked` : ``}>
      <label class="card__repeat-day" for="repeat-${day}">${day}</label>`).join(``)}
    </div>
  </fieldset>` : ``}`
);

const createTaskEditColorsTemplate = (currentColor) => (
  COLORS.map((color) => `<input
    type="radio"
    id="color-${color}"
    class="card__color-input card__color-input--${color} visually-hidden"
    name="color"
    value="${color}"
    ${currentColor === color ? `checked` : ``}>
    <label for="color-${color}" class="card__color card__color--${color}">${color}</label>`).join(``)
);

const createTaskEditTemplate = ({color, description, dueDate, repeating, isDueDate, isRepeating}) => {

  const dateTemplate = createTaskEditDateTemplate(dueDate, isDueDate);

  const repeatingClassName = isRepeating ? `card--repeat` : ``;

  const repeatingTemplate = createTaskEditRepeatingTemplate(repeating, isRepeating);

  const colorsTemplate = createTaskEditColorsTemplate(color);

  const isSubmitDisabled = (isDueDate && dueDate === null) || (isRepeating && !isTaskRepeating(repeating));

  return `<article class="card card--edit card--${color} ${repeatingClassName} ${repeatingClassName}">
    <form class="card__form" method="get">
      <div class="card__inner">
        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>

        <div class="card__textarea-wrap">
          <label>
            <textarea
              class="card__text"
              placeholder="Start typing your text here..."
              name="text"
            >${he.encode(description)}</textarea>
          </label>
        </div>

        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              ${dateTemplate}

              ${repeatingTemplate}
            </div>
          </div>

          <div class="card__colors-inner">
            <h3 class="card__colors-title">Color</h3>
            <div class="card__colors-wrap">
              ${colorsTemplate}
            </div>
          </div>
        </div>

        <div class="card__status-btns">
          <button class="card__save" type="submit" ${isSubmitDisabled ? `disabled` : ``}>save</button>
          <button class="card__delete" type="button">delete</button>
        </div>
      </div>
    </form>
  </article>`;
};

class TaskEdit extends SmartView {
  constructor(task = BLANK_TASK) {
    super();
    this._data = TaskEdit.parseTaskToData(task);
    this._datepicker = null;

    this._handler = {
      formSubmit: this._formSubmitHandler.bind(this),
      formDeleteClick: this._formDeleteClickHandler.bind(this),
      descriptionInput: this._descriptionInputHandler.bind(this),
      dueDateToggle: this._dueDateToggleHandler.bind(this),
      dueDateChange: this._dueDateChangeHandler.bind(this),
      repeatingToggle: this._repeatingToggleHandler.bind(this),
      repeatingChange: this._repeatingChangeHandler.bind(this),
      colorChange: this._colorChangeHandler.bind(this)
    };

    this._setInnerHandlers();
    this._setDatepicker();
  }

  // Перегружаем метод родителя removeElement,
  // чтобы при удалении удалялся более ненужный календарь
  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  reset(task) {
    this.updateData(TaskEdit.parseTaskToData(task));
  }

  getTemplate() {
    return createTaskEditTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setDatepicker() {
    if (this._datepicker) {
      // В случае обновления компонента удаляем вспомогательные DOM-элементы,
      // которые создает flatpickr при инициализации
      this._datepicker.destroy();
      this._datepicker = null;
    }

    this._initDatepicker();
  }

  _initDatepicker() {
    if (!this._data.isDueDate) {
      return;
    }

    // flatpickr есть смысл инициализировать только в случае,
    // если поле выбора даты доступно для заполнения
    this._datepicker = flatpickr(
        this.getElement().querySelector(`.card__date`),
        {
          dateFormat: `j F`,
          defaultDate: this._data.dueDate,
          onChange: this._handler.dueDateChange // На событие flatpickr передаём наш колбэк
        }
    );
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, this._handler.dueDateToggle);
    this.getElement()
      .querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, this._handler.repeatingToggle);
    this.getElement()
      .querySelector(`.card__text`)
      .addEventListener(`input`, this._handler.descriptionInput);


    if (this._data.isRepeating) {
      this.getElement()
        .querySelector(`.card__repeat-days-inner`)
        .addEventListener(`change`, this._handler.repeatingChange);
    }

    this.getElement()
      .querySelector(`.card__colors-wrap`)
      .addEventListener(`change`, this._handler.colorChange);
  }

  _dueDateToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isDueDate: !this._data.isDueDate,
      // Логика следующая: если выбор даты нужно показать,
      // то есть когда "!this._data.isDueDate === true",
      // тогда isRepeating должно быть строго false,
      // что достигается логическим оператором &&
      isRepeating: !this._data.isDueDate && false
    });
  }

  _repeatingToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isRepeating: !this._data.isRepeating,
      // Аналогично, но наоборот, для повторения
      isDueDate: !this._data.isRepeating && false
    });
  }

  _descriptionInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      description: evt.target.value
    }, true);
  }

  _dueDateChangeHandler([userDate]) {
    // По заданию дедлайн у задачи устанавливается без учёта времеми,
    // но объект даты без времени завести нельзя,
    // поэтому будем считать срок у всех задач -
    // это 23:59:59 установленной даты
    userDate.setHours(23, 59, 59, 999);

    this.updateData({
      dueDate: userDate
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(TaskEdit.parseDataToTask(this._data));
  }

  _repeatingChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      repeating: Object.assign(
          {},
          this._data.repeating,
          {[evt.target.value]: evt.target.checked}
      )
    });
  }

  _colorChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      color: evt.target.value
    });
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._handler.formSubmit);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(TaskEdit.parseDataToTask(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.card__delete`).addEventListener(`click`, this._handler.formDeleteClick);
  }

  static parseTaskToData(task) {
    return Object.assign(
        {},
        task,
        {
          isDueDate: task.dueDate !== null,
          isRepeating: isTaskRepeating(task.repeating)
        }
    );
  }

  static parseDataToTask(data) {
    data = Object.assign({}, data);

    if (!data.isDueDate) {
      data.dueDate = null;
    }

    if (!data.isRepeating) {
      data.repeating = {
        mo: false,
        tu: false,
        we: false,
        th: false,
        fr: false,
        sa: false,
        su: false
      };
    }

    delete data.isDueDate;
    delete data.isRepeating;

    return data;
  }
}

export default TaskEdit;
