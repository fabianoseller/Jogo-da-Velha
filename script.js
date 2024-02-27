const currentjogadorplay = document.querySelector(".currentjogadorplay");
let selecionado;
let jogadorplay = "X";

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
  currentjogadorplay.textContent = `JOGADOR DA VEZ: ${jogadorplay}`;

  document.querySelectorAll(".game button").forEach((item) => {
    item.textContent = "";
    item.addEventListener("click", newMove);
  });
}

function newMove(e) {
  const index = parseInt(e.target.dataset.i);
  e.target.textContent = jogadorplay;
  e.target.removeEventListener("click", newMove);
  selecionado[index] = jogadorplay;

  setTimeout(check, 100);
  
  jogadorplay = jogadorplay === "X" ? "O" : "X";
  currentjogadorplay.textContent = `Jogador 01: ${jogadorplay}`;
}

function check() {
  const jogadorplayLastMove = jogadorplay === "X" ? "O" : "X";
  
  for (const pos of posicao
) {
    if (pos.every((item) => selecionado[item - 1] === jogadorplayLastMove)) {
      alert(`O Jogador '${jogadorplayLastMove}' Se deu bem!`);
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
