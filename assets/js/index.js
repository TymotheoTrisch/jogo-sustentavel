function verificarTermino() {
    const respostas = JSON.parse(localStorage.getItem('pontuacoes'))
    const totalRespostas =
        (respostas.Produto_Energia?.length || 0) +
        (respostas.Transporte?.length || 0) +
        (respostas.Reciclagem?.length || 0);

    if (totalRespostas === 12) {
        window.location.href = './assets/telas/resultados.html';
    }

}

function verificarPerguntas() {
    const respostas = JSON.parse(localStorage.getItem('pontuacoes'))
    const totalRespostas =
        (respostas.Produto_Energia?.length || 0) +
        (respostas.Transporte?.length || 0) +
        (respostas.Reciclagem?.length || 0);

    localStorage.removeItem('pontuacoes');


    if (totalRespostas >= 1 && totalRespostas < 12) {
        window.location.href = './assets/telas/pergunta.html'
    }
}

verificarPerguntas();
verificarTermino();