import {getRandomInteger} from "./utils.js";

const Task = {
  COUNT: getRandomInteger(15, 25),
  COUNT_PER_STEP: 8
};

const COLORS = [`black`, `yellow`, `blue`, `green`, `pink`];

const PlaceTemplate = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

export {Task, COLORS, PlaceTemplate};
