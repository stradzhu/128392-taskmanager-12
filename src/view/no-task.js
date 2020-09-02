import AbstractView from './abstract';

const createNoTaskTemplate = () => `<p class="board__no-tasks">Click «ADD NEW TASK» in menu to create your first task</p>`;

class NoTask extends AbstractView {
  getTemplate() {
    return createNoTaskTemplate();
  }
}

export default NoTask;
