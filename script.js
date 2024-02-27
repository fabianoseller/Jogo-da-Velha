const currentPlayerElement = document.querySelector(".currentPlayer");
const gameButtons = document.querySelectorAll(".game button");

let player = "X";
let selected = [];

const winningPositions = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9], // Linhas
  [1, 4, 7], [2, 5, 8], [3, 6, 9], // Colunas
  [1, 5, 9], [3, 5, 7]              // Diagonais
];

function init() {
  selected = [];
  currentPlayerElement.textContent = `JOGADOR DA VEZ: ${player}`;

  gameButtons.forEach(button => {
    button.textContent = "";
    button.addEventListener("click", newMove);
  });
}

function newMove(e) {
  const index = parseInt(e.target.getAttribute("data-i"));
  e.target.textContent = player;
  e.target.removeEventListener("click", newMove);
  selected[index] = player;

  check();
  
  player = player === "X" ? "O" : "X";
  currentPlayerElement.textContent = `JOGADOR DA VEZ: ${player}`;
}

function check() {
  const playerLastMove = player === "X" ? "O" : "X";

  for (const pos of winningPositions) {
    if (pos.every(item => selected[item] === playerLastMove)) {
      alert(`O JOGADOR '${playerLastMove}' GANHOU!`);
      init();
      return;
    }
  }

  if (selected.filter(item => item).length === 9) {
    alert("DEU EMPATE!");
    init();
    return;
  }
}

init();
