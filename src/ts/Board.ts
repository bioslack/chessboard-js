import GameElement from "./GameElement";
import { Square as Coordination, PieceType, ChessInstance } from "chess.js";

const bb = new  URL("./assets/bb.png?as=webp&width=250", import.meta.url);
const bk = new  URL("./assets/bk.png?as=webp&width=250", import.meta.url);
const bn = new  URL("./assets/bn.png?as=webp&width=250", import.meta.url);
const bp = new  URL("./assets/bp.png?as=webp&width=250", import.meta.url);
const bq = new  URL("./assets/bq.png?as=webp&width=250", import.meta.url);
const br = new  URL("./assets/br.png?as=webp&width=250", import.meta.url);
const wb = new  URL("./assets/wb.png?as=webp&width=250", import.meta.url);
const wk = new  URL("./assets/wk.png?as=webp&width=250", import.meta.url);
const wn = new  URL("./assets/wn.png?as=webp&width=250", import.meta.url);
const wp = new  URL("./assets/wp.png?as=webp&width=250", import.meta.url);
const wq = new  URL("./assets/wq.png?as=webp&width=250", import.meta.url);
const wr = new  URL("./assets/wr.png?as=webp&width=250", import.meta.url);


const pieces = { bb, bk, bn, bp, bq, br, wb, wk, wn, wp, wq, wr };

interface SquareData {
  square: Coordination;
  type: PieceType;
  color: "w" | "b";
}

class Square implements GameElement {
  data?: SquareData | null;
  row: number;
  column: number;

  constructor(row: number, column: number, data?: SquareData | null) {
    this.data = data;
    this.row = row;
    this.column = column;
  }

  render() {
    const color =
      this.row % 2 == 0
        ? this.column % 2 == 0
          ? "white"
          : "black"
        : this.column % 2 == 1
        ? "white"
        : "black";

    const square = document.createElement("div");
    square.classList.add("square");
    square.classList.add(`square--${color}`);

    if (this.data) {
      const piece = document.createElement("img");
      piece.style.width = "100%";
      piece.style.height = "100%";
      piece.src = pieces[`${this.data.color}${this.data.type}`].href;
      piece.alt = "Chess piece";
      piece.ariaColIndex = `${this.column}`;
      piece.ariaRowIndex = `${this.row}`;
      square.appendChild(piece);
    }
    square.ariaColIndex = `${this.column}`;
    square.ariaRowIndex = `${this.row}`;

    return square;
  }
}

class Row implements GameElement {
  rowData: (SquareData | null)[];
  index: number;

  constructor(rowData: (SquareData | null)[], index: number) {
    this.rowData = rowData || [];
    this.index = index;
  }

  render() {
    const row = document.createElement("div");
    row.classList.add("row");
    const rowIndex = this.index;
    this.rowData.forEach(function (square, column) {
      const sq = new Square(rowIndex, column, square);
      row.appendChild(sq.render());
    });
    return row;
  }
}

export default class Board implements GameElement {
  game: ChessInstance;
  origin: String;

  constructor(game: ChessInstance) {
    this.game = game;
    this.origin = "";
  }

  render() {
    const board = document.createElement("div");
    board.classList.add("chessboard");
    const self = this;

    this.game.board().forEach(function (r, index) {
      if (r) {
        const row = new Row(r, index);
        board.appendChild(row.render());
      }
    });

    return board;
  }
}
