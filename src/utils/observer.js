class Observer {
  constructor() {
    this._observers = [];
  }

  // TODO: если я переменную в add и remove, то не возникнет ли у меня проблем в классах, которые будут
  // наследоваться от Observer. Это получается будет Tasks.add() - и разбирайся потом и долго и нужно, что "add"
  // пришел к нам от прототипа Observer, и наверное, это что-то с ним связано...
  // P.S. что-то критерий Д3 начинает мне не нравиться :D уж много понятного кода приходится переименовывать
  // а из-за чего? Чтобы просто именование метода стало короче на 6-7 букв?
  // фух, выговорился, стало легче)))
  addObserver(observer) {
    this._observers.push(observer);
  }

  removeObserver(observer) {
    this._observers = this._observers.filter((existedObserver) => existedObserver !== observer);
  }

  _notify(event, payload) {
    this._observers.forEach((observer) => observer(event, payload));
  }
}

export default Observer;
