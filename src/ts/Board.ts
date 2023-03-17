import GameElement from "./GameElement";
import { Square as Coordination, PieceType, ChessInstance } from "chess.js";

import bb from "./assets/bb.png";
import bk from "./assets/bk.png";
import bn from "./assets/bn.png";
import bp from "./assets/bp.png";
import bq from "./assets/bq.png";
import br from "./assets/br.png";
import wb from "./assets/wb.png";
import wk from "./assets/wk.png";
import wn from "./assets/wn.png";
import wp from "./assets/wp.png";
import wq from "./assets/wq.png";
import wr from "./assets/wr.png";


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
      piece.src = pieces[`${this.data.color}${this.data.type}`];
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

    this.game.board().forEach(function (r, index) {
      if (r) {
        const row = new Row(r, index);
        board.appendChild(row.render());
      }
    });

    return board;
  }
}
