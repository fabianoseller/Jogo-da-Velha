const currentPlayer = document.querySelector(".currentPlayer");
let selecionado;
let player = "X";

const posicao = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];

function init() {
  selecionado = new Array(9).fill(null);
  currentPlayer.textContent = `JOGADOR DA VEZ: ${player}`;

  document.querySelectorAll(".game button").forEach((item) => {
    item.textContent = "";
    item.addEventListener("click", newMove);
  });
}

function newMove(e) {
  const index = parseInt(e.target.dataset.i);
  e.target.textContent = player;
  e.target.removeEventListener("click", newMove);
  selecionado[index] = player;

  setTimeout(check, 100);
  
  player = player === "X" ? "O" : "X";
  currentPlayer.textContent = `Jogador 01: ${player}`;
}

function check() {
  const playerLastMove = player === "X" ? "O" : "X";
  
  for (const pos of posicao
) {
    if (pos.every((item) => selecionado[item - 1] === playerLastMove)) {
      alert(`O JOGADOR '${playerLastMove}' GANHOU!`);
      init();
      return;
    }
  }

  if (selecionado.every((item) => item)) {
    alert("Ichhh Empatou!");
    init();
    return;
  }
}

init();
