async function calcularRespostas() {
    // Carrega as respostas do usuário do localStorage
    const respostasUsuario = JSON.parse(localStorage.getItem('pontuacoes'));
    
    console.log(respostasUsuario);

    // Carrega o arquivo JSON de perguntas
    const response = await fetch('../db/dados.json');
    const perguntas = await response.json();

    // Inicializa o objeto para armazenar os resultados por categoria
    const resultadosPorCategoria = {
        Produto_Energia: { corretas: 0, incorretas: 0 },
        Transporte: { corretas: 0, incorretas: 0 },
        Reciclagem: { corretas: 0, incorretas: 0 }
    };
    
    // Define valores para respostas objetivas
    const escalaObjetiva = {
        "Sempre": 1,
        "Frequentemente": 0.7,
        "Raramente": 0.4,
        "Nunca": 0
    };

    // Itera sobre cada pergunta e verifica a resposta do usuário
    perguntas.categories.forEach(categoria => {
        categoria.questions.forEach(pergunta => {
            const respostaUsuario = respostasUsuario[pergunta.category]?.find(
                r => r.pergunta === pergunta.question
            );

            if (respostaUsuario) {
                let correta;

                // Verifica a resposta com base no tipo
                if (pergunta.type === "quantitative") {
                    // Para respostas quantitativas                    
                    if(pergunta.correct_answer === "Maior número possível") {
                        switch (respostaUsuario.resposta) {
                            case 0:
                                
                                break;
                            case 0:
                                
                                break;
                            case 0:
                                
                                break;
                            case 0:
                                
                                break;
                        
                            default:
                                break;
                        }
                    }
                    
                    correta = parseFloat(respostaUsuario.resposta) >= parseFloat(pergunta.correct_answer);
                } else if (pergunta.type === "objective") {
                    // Para respostas objetivas
                    
                    const valorUsuario = escalaObjetiva[respostaUsuario.resposta];
                    const valorCorreto = escalaObjetiva[pergunta.correct_answer];
                    correta = valorUsuario >= valorCorreto;
                    
                } else {
                    // Para respostas binárias
                    correta = respostaUsuario.resposta === pergunta.correct_answer;
                }

                // Atualiza o contador de corretas/incorretas
                if (correta) {
                    resultadosPorCategoria[pergunta.category].corretas++;
                } else {
                    resultadosPorCategoria[pergunta.category].incorretas++;
                }
            }
        });
    });

    // Exibe os resultados no console ou os retorna para uso posterior
    console.log(resultadosPorCategoria);
    return resultadosPorCategoria;
}


function verificarRespostas() {
    const respostas = JSON.parse(localStorage.getItem('pontuacoes')) || {};

    const totalRespostas = 
        (respostas.Produto_Energia?.length || 0) + 
        (respostas.Transporte?.length || 0) + 
        (respostas.Reciclagem?.length || 0);

    if (totalRespostas !== 10) {
        window.location.href = "../../index.html";
    }
    
}

verificarRespostas();

// Chama a função
calcularRespostas();