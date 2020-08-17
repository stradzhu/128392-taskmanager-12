import AbstractView from './abstract.js';

const createBoardTemplate = () => `<section class="board container"></section>`;

class Board extends AbstractView {
  getTemplate() {
    return createBoardTemplate();
  }

}

export default Board;
