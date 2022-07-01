import { Chess, ChessInstance } from "chess.js";
import Board from "./Board";
import GameElement from "./GameElement";

const gameFromMoves = function (moves: string[]) {
  const game = new Chess();
  moves.forEach((m) => game.move(m));
  return game;
};

class History implements GameElement {
  history: String[];
  selected: number;
  constructor(history: String[], selected: number) {
    this.history = history;
    this.selected = selected;
  }

  render() {
    const d = document.createElement("div");
    d.classList.add("history");
    let moves = "";
    let turn = 1;
    const self = this;
    this.history.forEach(function (move, index) {
      if (index % 2 == 0)
        moves += `${turn++}.<span data-key="${index}" class="history__item ${
          self.selected === index ? "history__item--selected" : ""
        }">${move}</span>`;
      else
        moves += `<span data-key="${index}" class="history__item ${
          self.selected === index ? "history__item--selected" : ""
        }">${move}</span>`;
    });
    d.innerHTML = moves;
    d.scrollTo({
      top: d.querySelector(".history__item--selected")?.scrollHeight || 0,
    });

    return d;
  }
}

class Button implements GameElement {
  text: String;
  name: String;

  constructor(text: String, name: String) {
    this.text = text;
    this.name = name;
  }

  render() {
    const container = document.createElement("div");
    const btn = document.createElement("button");
    btn.classList.add("button");
    btn.type = "button";
    btn.name = `${this.name}`;
    container.appendChild(btn);

    btn.innerHTML = `${this.text}`;
    return container;
  }
}

class FileBrowser implements GameElement {
  name: String;

  constructor(name: String) {
    this.name = name;
  }

  render() {
    const container = document.createElement("div");
    // container.classList.add("button")
    const button = document.createElement("button");
    button.classList.add("button");
    button.name = `${this.name}`;
    button.innerHTML = "&#128449;";
    const input = document.createElement("input");
    input.name = `${this.name}-file`;
    input.style.display = "none";
    input.type = "file";
    input.accept = ".pgn";
    container.appendChild(input);
    container.appendChild(button);

    return container;
  }
}

class Controls implements GameElement {
  fileBrowser?: FileBrowser;
  buttonPrev?: Button;
  buttonNext?: Button;
  buttonEnd?: Button;
  buttonBegin?: Button;

  render() {
    const div = document.createElement("div");
    const form = document.createElement("form");

    this.buttonBegin = new Button("<<", "begin");
    this.buttonPrev = new Button("<", "prev");
    this.buttonNext = new Button(">", "next");
    this.buttonEnd = new Button(">>", "end");
    this.fileBrowser = new FileBrowser("open-game");

    div.classList.add("controls");
    div.appendChild(this.fileBrowser.render());
    div.appendChild(this.buttonBegin.render());
    div.appendChild(this.buttonPrev.render());
    div.appendChild(this.buttonNext.render());
    div.appendChild(this.buttonEnd.render());

    return div;
  }
}

export default class Game implements GameElement {
  currentGame?: ChessInstance;
  origin?: String;
  board?: Board;
  historyPanel?: History;

  historyBackward: string[];
  historyForward: string[];
  controls?: Controls;

  constructor() {
    this.historyBackward = [];
    this.historyForward = [];
    this.newGame();

    const main = document.querySelector(".main") as HTMLDivElement;
    const self = this;
    if (main) {
      main.addEventListener("dragstart", function (event) {
        const columns = "abcdefgh";
        const rows = "87654321";
        // @ts-ignore
        const i = event.target.ariaColIndex;
        // @ts-ignore
        const j = event.target.ariaRowIndex;
        self.origin = `${columns[i]}${rows[j]}`;
      });

      main.addEventListener("drop", function (event) {
        event.preventDefault();
        // @ts-ignore
        const i = event.target.ariaColIndex;
        // @ts-ignore
        const j = event.target.ariaRowIndex;
        self.move(i, j);
      });

      main.addEventListener("click", function (event) {
        const target = event.target as HTMLButtonElement;

        if (target.name === "begin") {
          self.begin();
        }

        if (target.name === "end") {
          self.end();
        }

        if (target.name === "prev") {
          self.backward();
        }

        if (target.name === "next") {
          self.forward();
        }

        if (target.name === "open-game") {
          const fileBrowser = document.querySelector(
            "input[name=open-game-file]"
          ) as HTMLInputElement;
          fileBrowser.click();
        }

        if (target.classList.contains("history__item")) {
          const span = event.target as HTMLSpanElement;
          self.goTo(+(span.dataset.key || 0));
        }
      });

      main.addEventListener("change", function (event) {
        // @ts-ignore
        if (event.target.name === "open-game-file") {
          const inputFile = event.target as HTMLInputElement;
          if (inputFile?.files) {
            const file = inputFile?.files[0];
            const reader = new FileReader();

            const handler = function (event: ProgressEvent<FileReader>) {
              if(event.target?.result)
                self.loadPGN(`${event.target.result}`);
              // reader.removeEventListener("load", handler);
            };
            reader.addEventListener("load", handler);

            reader.readAsText(file);
          }
        }
      });
    }
  }

  begin() {
    this.historyForward = [
      ...this.historyForward,
      ...this.historyBackward.slice().reverse(),
    ];
    this.historyBackward = [];
    this.currentGame = gameFromMoves([]);
    this.render();
  }

  goTo(index: number) {
    const history = [
      ...this.historyBackward,
      ...this.historyForward.slice().reverse(),
    ];
    this.historyBackward = [ ...history.slice(0, index+1)];
    this.historyForward = [ ...history.slice(index+1).reverse() ];
    this.currentGame = gameFromMoves(this.historyBackward);
    this.render();
  }

  end() {
    this.historyBackward = [
      ...this.historyBackward,
      ...this.historyForward.slice().reverse(),
    ];
    this.historyForward = [];
    this.currentGame = gameFromMoves(this.historyBackward);
    this.render();
  }

  backward() {
    if (this.historyBackward.length > 0) {
      const move = this.historyBackward[this.historyBackward.length - 1];
      this.historyBackward = this.historyBackward.slice(0, -1);
      this.historyForward = [...this.historyForward, move];
      this.currentGame = gameFromMoves(this.historyBackward);
      this.render();
    }
  }

  forward() {
    if (this.historyForward.length > 0) {
      const move = this.historyForward[this.historyForward.length - 1];
      this.historyForward = this.historyForward.slice(0, -1);
      this.historyBackward = [...this.historyBackward, move];
      this.currentGame = gameFromMoves(this.historyBackward);
      this.render();
    }
  }

  loadPGN(pgn: String) {
    this.currentGame = new Chess();
    this.currentGame.load_pgn(`${pgn}`);
    this.historyBackward = this.currentGame.history();
    this.historyForward = [];
    this.render();
  }

  move(i: number, j: number) {
    const columns = "abcdefgh";
    const rows = "87654321";

    const old = new Chess();
    old.load_pgn(this.currentGame!.pgn());
    const moveValid = this.currentGame!.move(
      `${this.origin}${columns[i]}${rows[j]}`,
      {
        sloppy: true,
      }
    );

    if (moveValid) {
      this.historyBackward = this.currentGame!.history();
      this.historyForward = [];

      this.render();
    }
  }

  newGame() {
    this.currentGame = new Chess();
    this.render();
  }

  render() {
    const sidePanel = document.createElement("div");

    sidePanel.classList.add("side-panel");
    this.board = new Board(this.currentGame!);
    this.historyPanel = new History(
      [...this.historyBackward, ...this.historyForward.slice().reverse()],
      this.historyBackward.length - 1
    );
    this.controls = new Controls();
    const main = document.querySelector(".main");

    if (main) {
      main.innerHTML = "";
      main.appendChild(this.board.render());

      sidePanel.appendChild(this.historyPanel.render());
      sidePanel.appendChild(this.controls.render());
      main.appendChild(sidePanel);
    }

    return this.board.render();
  }
}
