import {COLORS} from '../const.js';
import {getRandomInteger} from '../utils.js';

const generateDescription = () => {
  const descriptions = [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`
  ];
  const randomIndex = getRandomInteger(0, descriptions.length - 1);
  return descriptions[randomIndex];
};

const generateDate = () => {
  const isDate = Boolean(getRandomInteger(0, 1));
  if (!isDate) {
    return null;
  }

  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const currentDate = new Date();

  currentDate.setHours(23, 59, 59, 999);
  currentDate.setDate(currentDate.getDate() + daysGap);

  return new Date(currentDate);
};

const generateRepeating = () => ({
  mo: Boolean(getRandomInteger(0, 1)),
  tu: false,
  we: Boolean(getRandomInteger(0, 1)),
  th: false,
  fr: Boolean(getRandomInteger(0, 1)),
  sa: false,
  su: Boolean(getRandomInteger(0, 1))
});

const getRandomColor = () => COLORS[getRandomInteger(0, COLORS.length - 1)];

const generateTask = () => {
  const dueDate = generateDate();
  const repeating = dueDate === null
    ? generateRepeating()
    : {
      mo: false,
      tu: false,
      we: false,
      th: false,
      fr: false,
      sa: false,
      su: false
    };
  return {
    description: generateDescription(),
    dueDate,
    repeating,
    color: getRandomColor(),
    isArchive: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};

export {generateTask};

