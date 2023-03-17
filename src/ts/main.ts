import "../css/styles.css";
import Game from "./Game";

const main = document.createElement("div");
main.classList.add("main");
document.body.appendChild(main);

document.addEventListener("dragover", function(event) {
    event.preventDefault();
})

const game = new Game();

game.render();
