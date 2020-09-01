import {getRandomInteger} from './utils/common';

const COLORS = [`black`, `yellow`, `blue`, `green`, `pink`];

const TaskParam = {
  COUNT: getRandomInteger(15, 25),
  COUNT_PER_STEP: 8
};

const ESCAPE_KEY_CODE = 27;

const SortType = [
  {type: `default`, title: `SORT BY DEFAULT`},
  {type: `date-up`, title: `SORT BY DATE up`},
  {type: `date-down`, title: `SORT BY DATE down`}
];

export {COLORS, TaskParam, ESCAPE_KEY_CODE, SortType};
