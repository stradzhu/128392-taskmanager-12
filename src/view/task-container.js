import AbstractView from './abstract';

const createTaskContainerTemplate = () => `<div class="board__tasks"></div>`;

class TaskContainer extends AbstractView {
  getTemplate() {
    return createTaskContainerTemplate();
  }
}

export default TaskContainer;
