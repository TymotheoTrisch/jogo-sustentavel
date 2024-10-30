async function calcularRespostas() {
    const respostasUsuario = JSON.parse(localStorage.getItem('pontuacoes'));

    const response = await fetch('../db/dados.json');
    const perguntas = await response.json();

    const acertosPorCategoria = {
        Produto_Energia: { corretas: 0, incorretas: 0 },
        Transporte: { corretas: 0, incorretas: 0 },
        Reciclagem: { corretas: 0, incorretas: 0 }
    };

    const resultadosPorCategoria = {
        Produto_Energia: 0,
        Transporte: 0,
        Reciclagem: 0
    };

    const escalaObjetiva = {
        "Sempre": 1,
        "Frequentemente": 0.7,
        "Raramente": 0.4,
        "Nunca": 0
    };

    perguntas.questions.forEach(pergunta => {
        const respostaUsuario = respostasUsuario[pergunta.category]?.find(
            r => r.pergunta === pergunta.question
        );

        if (respostaUsuario) {
            let correta;

            if (pergunta.type === "quantitative") {
                correta = respostaUsuario.resposta >= pergunta.min_answer;

            } else if (pergunta.type === "objective") {
                const valorUsuario = escalaObjetiva[respostaUsuario.resposta];
                const valorCorreto = escalaObjetiva[pergunta.correct_answer];
                correta = valorUsuario >= valorCorreto;
            } else {
                correta = respostaUsuario.resposta === pergunta.correct_answer;
            }

            if (correta) {
                acertosPorCategoria[pergunta.category].corretas++;

                resultadosPorCategoria[pergunta.category]++;
            } else {
                if (pergunta.type === "objective" && respostaUsuario.resposta != "Sempre") {


                    resultadosPorCategoria[pergunta.category] += escalaObjetiva[respostaUsuario.resposta];
                }
                acertosPorCategoria[pergunta.category].incorretas++;
            }
        }
    });

    const pontuacaoTotal = Object.values(resultadosPorCategoria).reduce((acc, curr) => acc + curr, 0);
    

    return { resultadosPorCategoria, acertosPorCategoria, pontuacaoTotal };
}


function verificarRespostas() {
    const respostas = JSON.parse(localStorage.getItem('pontuacoes')) || {};

    const totalRespostas =
        (respostas.Produto_Energia?.length || 0) +
        (respostas.Transporte?.length || 0) +
        (respostas.Reciclagem?.length || 0);

    if (totalRespostas !== 12) {
        window.location.href = "../../index.html";
    }

}

verificarRespostas();