import {getRandomInteger} from "./utils.js";

const TASK_COUNT = getRandomInteger(5, 5);
const TASK_COUNT_PER_STEP = 8;
const COLORS = [`black`, `yellow`, `blue`, `green`, `pink`];

const PlaceTemplate = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

export {TASK_COUNT, TASK_COUNT_PER_STEP, COLORS, PlaceTemplate};
