import Game from "./Game";

document.addEventListener("dragover", function(event) {
    event.preventDefault();
})

const game = new Game();

game.render();

// const chess = new Chess();

// const board = new Board(chess);
// board.render();
// const h = new History().render();
// document.querySelector(".main")?.append(h);
