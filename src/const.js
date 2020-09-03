import {getRandomInteger} from './utils/common';

const COLORS = [`black`, `yellow`, `blue`, `green`, `pink`];

const TaskParam = {
  COUNT: getRandomInteger(15, 25),
  COUNT_PER_STEP: 8
};

const ESCAPE_KEY_CODE = 27;

const SortType = {
  DEFAULT: `default`,
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`
};

const UserAction = {
  UPDATE_TASK: `UPDATE_TASK`,
  ADD_TASK: `ADD_TASK`,
  DELETE_TASK: `DELETE_TASK`
};

const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

const FilterType = {
  ALL: `all`,
  OVERDUE: `overdue`,
  TODAY: `today`,
  FAVORITES: `favorites`,
  REPEATING: `repeating`,
  ARCHIVE: `archive`
};

export {COLORS, TaskParam, ESCAPE_KEY_CODE, SortType, UserAction, UpdateType, FilterType};
