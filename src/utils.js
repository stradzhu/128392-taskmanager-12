const PlaceTemplate = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);
  return new Date(currentDate);
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const isTaskExpired = (dueDate) => {
  if (dueDate === null) {
    return false;
  }
  const currentDate = getCurrentDate();
  return currentDate.getTime() > dueDate.getTime();
};

const isTaskExpiringToday = (dueDate) => {
  if (dueDate === null) {
    return false;
  }
  const currentDate = getCurrentDate();
  return currentDate.getTime() === dueDate.getTime();
};

const isTaskRepeating = (repeating) => Object.values(repeating).some(Boolean);

const humanizeTaskDueDate = (dueDate) => dueDate.toLocaleString(`en-US`, {day: `numeric`, month: `long`});

const render = (container, element, place = PlaceTemplate.BEFOREEND) => {
  switch (place) {
    case PlaceTemplate.BEFOREBEGIN:
      container.before(element);
      break;
    case PlaceTemplate.AFTERBEGIN:
      container.prepend(element);
      break;
    case PlaceTemplate.BEFOREEND:
      container.append(element);
      break;
    case PlaceTemplate.AFTEREND:
      container.after(element);
      break;
  }
};

const renderTemplate = (container, template, place = PlaceTemplate.BEFOREEND) => {
  container.insertAdjacentHTML(place, template);
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export {getRandomInteger, isTaskExpired, isTaskExpiringToday, isTaskRepeating, humanizeTaskDueDate, render, renderTemplate, createElement};
