import AbstractView from "./abstract";

const createNoTaskTemplate = () => {
  return `<p class="board__no-tasks">
    Loading...
  </p>`;
};

class Loading extends AbstractView {
  getTemplate() {
    return createNoTaskTemplate();
  }
}

export default Loading;
