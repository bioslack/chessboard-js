import Game from "./Game";

document.addEventListener("dragover", function(event) {
    event.preventDefault();
})

const game = new Game();

game.render();