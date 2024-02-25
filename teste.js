//Retirado de http://henriquevianna.com/code/ia/jogo-da-velha.html
		
estado = [];	// estado do tabuleiro na tela
var raiz; 			// primeiro nodo da arvore
var atual;			// ponteiro para o nodo que representa o estado atual do jogo

var pilha = []; // array de ponteiros para nodo - usada para construir a �rvore
var nodos = 0;	// nodos na �rvore

/* validação de campos
/* objeto nodo: 

	{ pai: ponteiro para nodo,
	  estado: array[3][3] de char,
	  filhos: array de ponteiros para nodo,
	  jogador: char,
	  minimax: int }
*/

window.onload = function() {
  inicializa();
};

function inicializa() {
	estado = [ [],[],[] ];
	raiz = null;
	atual = null;
	
	exibeEstado(estado);
}

function geraArvore() {
	pilha = []; // limpa pilha
	nodos = 0;
	// gera nodo raiz a partir do estado do tabuleiro na tela (vazio ou com a primeira jogada do humano)
	raiz = {pai: null, estado: estado, filhos: [], jogador: "O", minimax: null};
	pilha.push(raiz);	// coloca na pilha

	
	while (pilha.length) {		// enquanto houver elementos na pilha
		nodo = pilha.pop();		// retira um nodo
		geraFilhos(nodo);		// e gera filhos desse nodo
	}

	calculaMinimax(raiz);	// calcula valores Minimax a partir da raiz
	atual = raiz;	// situa��o atual do jogo
}
	
	
function geraFilhos(pai) {
	var estado = [];
	var x,y,minimax;
	var	jogador = (pai.jogador=="x")?"o":"x";	// verifica de quem � a vez de jogar nesse n�vel
	
	for (y=0; y<3; y++)
		for (x=0; x<3; x++)
			if (pai.estado[y][x] == undefined) {	// se encontrou espa�o vago no tabuleiro
				estado = copiaEstado(pai.estado);	// gera uma c�pia do estado atual
				estado[y][x] = jogador;				// adiciona a jogada
				var nodo = {pai: pai, estado: estado, filhos: [], jogador: jogador, minimax: null};	// cria um novo nodo para o filho

				nodo.minimax = ehTerminal(nodo.estado,0);	// se for nodo terminal, recebe valor de utilidade 
				pai.filhos.push(nodo);	// adiciona esse nodo no array de filhos do nodo pai
				nodos++;

				if (!nodo.minimax)		// se filho n�o � terminal, vai para a pilha, para gerar os filhos dele
					pilha.push(nodo);
			}
}

function calculaMinimax(nodo) {	// calcula o valor minimax de um nodo
	var i, min, max;
	for (i=0; i < nodo.filhos.length; i++) {	// percorre todos os filhos do nodo
		if (nodo.filhos[i].minimax === null)	// se um filho ainda n�o tem um valor minimax (n�o � folha da �rvore)
			calculaMinimax(nodo.filhos[i]);		// chama a fun��o recursivamente para aquele filho

		if (max == undefined || nodo.filhos[i].minimax > max)	// guarda valor max (maior minimax entre os filhos)
			max = nodo.filhos[i].minimax;
		if (min == undefined || nodo.filhos[i].minimax < min)	// guarda valor min (menor minimax entre os filhos)
			min = nodo.filhos[i].minimax;
	}
	if (nodo.jogador == "o")
		nodo.minimax = max;		// se a pr�xima jogada � da CPU, retorna valor max
	else
		nodo.minimax = min;		// caso contr�rio, retorna valor min
}

function ehTerminal(estado,encerra) {	// verifica se estado � terminal, retornando seu valor de utilidade
	var x,y;							// retorna null caso n�o seja estado terminal
	var brancos = 0;					// encerra = 0 para calcular o valor de utilidade durante a gera��o da �rvore
	var utilidade = null;				//         = 1 para encerrar o jogo quando estado for terminal
	
	for (y=0; y<3; y++)		// testa linhas
		if (estado[y][0] != undefined && estado[y][0] == estado[y][1] && estado[y][0] == estado[y][2]) {
			utilidade = (estado[y][0] == "x")? 1: -1;	// utilidade 1 para X (CPU), -1 para O (humano)
			break;
		}
	if (!utilidade)			// testa colunas
		for (x=0; x<3; x++)	
			if (estado[0][x] != undefined && estado[0][x] == estado[1][x] && estado[0][x] == estado[2][x]) {
				utilidade = (estado[0][x] == "x")? 1: -1;
				break;
			}
	if (!utilidade)			// testa diagonais
		if ( estado[1][1] != undefined && (
			 (estado[0][0] == estado[1][1] && estado[0][0] == estado[2][2]) ||
			 (estado[0][2] == estado[1][1] && estado[0][2] == estado[2][0])    ) )
			utilidade = (estado[1][1] == "x")? 1: -1;
				
	for (y=0; y<3; y++)
		for (x=0; x<3; x++)
			if (estado[y][x] == undefined)	// conta espa�os em branco no tabuleiro
				brancos++;
				
	if (utilidade)					// se achou um vencedor
		if (encerra)
			if (utilidade > 0){		// utilidade > 0 venceu CPU
				showMessage("Perdeu Playboy", "Eu ganhei ^^");
        inicializa();
      }
			else{
				showMessage("Comassim???? :'(", "Você ganhou");	// essa mensagem nunca será exibida :)
        inicializa();
      }
		else
			return utilidade*(brancos+1); 	// retorna valor de utilidade - n� de casas vagas d� um peso maior,
											// favorecendo a escolha da jogada vitoriosa no n�vel mais raso
	else							
		if (!brancos)				// se n�o tem mais espa�os em branco tamb�m � terminal...
			if (encerra){
				showMessage("De novo...", "Empatamos .-.");
        inicializa();
      }
			else
				return 0;			// ...com utilidade 0 (empate)
		else
			return null; 			// se ainda tem brancos, n�o � terminal
}


function jogaHumano(elemento) {
	var i = Number(elemento[0]); // pega linha a partir da id do elemento (ex. "p02")
	var j = Number(elemento[1]); // pega coluna a partir da id do elemento
  
	if (estado[i][j] != undefined) {
		showMessage("Posição inválida", i.toString() + j.toString());
		return;
	}
	else {
		estado[i][j] = "o";		// coloca a jogada do humano
		exibeEstado(estado);	// atualiza tabuleiro na tela
	}
	
	if (!ehTerminal(estado,1)) {	// verifica se jogada do humano resultou em um estado terminal
		if (!raiz)			// se raiz � null, �rvore ainda n�o foi gerada (humano come�a o jogo)
			geraArvore();	// a raiz ser� o estado atual, j� com a jogada do humano
		else
			for (i=0;i < atual.filhos.length; i++)	// procura nos filhos do estado atual, qual representa a situa��o ap�s a jogada do humano
				if (comparaEstados(estado,atual.filhos[i].estado)) {
					atual = atual.filhos[i];
					break;
				}
		jogaCPU();	// passa a vez para a CPU
	}
}

function jogaCPU() {
	var max;
	var opcoes = [];	// array das op��es de jogadas
	var i,r;
	
	if (!raiz)			// se raiz � null, �rvore ainda n�o foi gerada (CPU come�a o jogo)
		geraArvore();
	
	// avalia qual a melhor op��o de jogada, dentre as poss�veis (filhos do estado atual)
	for (i=0;i < atual.filhos.length; i++) {
		if (atual.filhos[i].minimax != null && (max == undefined || atual.filhos[i].minimax > max))
			max = atual.filhos[i].minimax;	// salva maior valor minimax dos filhos
	}
	
	// percorre novamente os filhos, checando todos que tenham o mesmo valor minimax �timo
	for (i=0;i < atual.filhos.length; i++)
		if (atual.filhos[i].minimax == max)
			opcoes.push(i);	// coloca �ndice deste filho no array de op��es de jogada
		
	// e escolhe aleatoriamente um deles, para dar mais variedade �s jogadas
	r = Math.floor(Math.random()*opcoes.length);
	atual = atual.filhos[opcoes[r]];
	estado = atual.estado;
	exibeEstado(estado);
	
	ehTerminal(estado,1);	// Verifica se atingiu estado terminal, encerrando o jogo 
}

/* fun��es de display */

function exibeEstado(estado) {	// atualiza tabuleiro na tela
	for (var i=0; i<3; i++)
		for (var j=0; j<3; j++) {
			elemento = document.getElementById(i.toString() + j.toString());
			if (estado[i][j] == undefined)
				elemento.innerHTML = "&nbsp;";
			else
				elemento.innerHTML = estado[i][j];
		}
}

function showMessage(msg, winner="") {
  document.getElementById("winner").innerText = winner;
  document.getElementById("text").innerText = msg;
  document.getElementById("open").click();
}

/* fun��es auxiliares */

function copiaEstado(estado) {
	var retorno = [];
	for(var i = 0; i < estado.length; i++)	// copia elementos do array
		retorno[i] = estado[i].slice(0);	// necess�rio para evitar a c�pia por refer�ncia
    
	return retorno;
}

function comparaEstados(estado1,estado2) {
	for (var i=0; i<3; i++)
		for (var j=0; j<3; j++)
			if (estado1[i][j] != estado2[i][j])
				return false;
				
	return true;
}