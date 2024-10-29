async function calcularRespostas() {
    const respostasUsuario = JSON.parse(localStorage.getItem('pontuacoes'));
    
    console.log(respostasUsuario);

    const response = await fetch('../db/dados.json');
    const perguntas = await response.json();
    
    const resultadosPorCategoria = {
        Produto_Energia: 0,
        Transporte: 0,
        Reciclagem: 0
    }

    const acertosPorCategoria = {
        Produto_Energia: { corretas: 0, incorretas: 0 },
        Transporte: { corretas: 0, incorretas: 0 },
        Reciclagem: { corretas: 0, incorretas: 0 }
    };
    
    const escalaObjetiva = {
        "Sempre": 1,
        "Frequentemente": 0.7,
        "Raramente": 0.4,
        "Nunca": 0
    };

    perguntas.categories.forEach(categoria => {
        categoria.questions.forEach(pergunta => {
            const respostaUsuario = respostasUsuario[pergunta.category]?.find(
                r => r.pergunta === pergunta.question
            );

            if (respostaUsuario) {
                let correta;
                

                if (pergunta.type === "quantitative") {                   
                    if(pergunta.correct_answer === "Maior número possível") {
                        if(respostaUsuario.resposta >= 1) {
                            
                        }
                    }
                    
                    // correta = parseFloat(respostaUsuario.resposta) >= parseFloat(pergunta.correct_answer);
                } else if (pergunta.type === "objective") {
                    
                    const valorUsuario = escalaObjetiva[respostaUsuario.resposta];
                    const valorCorreto = escalaObjetiva[pergunta.correct_answer];
                    
                    resultadosPorCategoria[pergunta.category] += valorUsuario;
                    
                    correta = valorUsuario >= valorCorreto;
                    
                } else {
                    correta = respostaUsuario.resposta === pergunta.correct_answer;
                }

                if (correta) {
                    acertosPorCategoria[pergunta.category].corretas++;
                } else {
                    acertosPorCategoria[pergunta.category].incorretas++;
                }
            }
        });
    });

    console.log(acertosPorCategoria);
    return acertosPorCategoria;
}


function verificarRespostas() {
    const respostas = JSON.parse(localStorage.getItem('pontuacoes')) || {};

    const totalRespostas = 
        (respostas.Produto_Energia?.length || 0) + 
        (respostas.Transporte?.length || 0) + 
        (respostas.Reciclagem?.length || 0);

    if (totalRespostas !== 10) {
        // window.location.href = "../../index.html";
    }
    
}

verificarRespostas();

// Chama a função
calcularRespostas();