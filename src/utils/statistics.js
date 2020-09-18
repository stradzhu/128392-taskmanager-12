import {Color} from '../const';
import moment from 'moment';

const colorToHex = {
  [Color.BLACK]: `#000000`,
  [Color.BLUE]: `#0c5cdd`,
  [Color.GREEN]: `#31b55c`,
  [Color.PINK]: `#ff3cb9`,
  [Color.YELLOW]: `#ffe125`
};

// Используем особенности Set, чтобы удалить дубли в массиве
const makeItemsUniq = (items) => [...new Set(items)];

const parseChartDate = (date) => moment(date).format(`D MMM`);


const countTasksByColor = (tasks, color) => {
  return tasks.filter((task) => task.color === color).length;
};

const isDueDateSame = (dateA, dateB) => moment(dateA).isSame(dateB);

const countTasksInDateRange = (dates, tasks) => {
  return dates.map(
      (date) => tasks.filter(
          (task) => isDueDateSame(task.dueDate, date)
      ).length
  );
};

const countCompletedTaskInDateRange = (tasks, dateFrom, dateTo) => {
  const checkDueDateInPeriod = (dueDate) => moment(dueDate).isSame(dateFrom) ||
    moment(dueDate).isBetween(dateFrom, dateTo) ||
    moment(dueDate).isSame(dateTo);

  return tasks.reduce((counter, task) => {
    if (!task.dueDate) {
      return counter;
    }

    // С помощью moment.js проверям, сколько задач с дедлайном
    // попадают в диапазон дат
    if (checkDueDateInPeriod(task.dueDate)) {
      return counter + 1;
    }

    return counter;
  }, 0);
};

const getDatesInRange = (dateFrom, dateTo) => {
  const dates = [];
  let stepDate = new Date(dateFrom);

  // Нам нужно получить все даты из диапазона,
  // чтобы корректно отразить их на графике.
  // Для этого проходим в цикле от даты "от"
  // до даты "до" и каждый день, что между,
  // заносим в результирующий массив dates
  while (moment(stepDate).isSameOrBefore(dateTo)) {
    dates.push(new Date(stepDate));
    stepDate.setDate(stepDate.getDate() + 1);
  }

  return dates;
};

export {colorToHex, parseChartDate, makeItemsUniq, countTasksInDateRange, countTasksByColor, countCompletedTaskInDateRange, getDatesInRange};
