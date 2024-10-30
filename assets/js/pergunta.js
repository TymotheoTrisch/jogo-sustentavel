const question = document.getElementById('question');
const botaoProximo = document.getElementById('btn-proximo');

function adjustFontSize() {

    let fontSize = 100;
    question.style.fontSize = fontSize + 'px';
    const box = document.querySelector(".div-question")


    while (question.scrollHeight > box.clientHeight || question.scrollWidth > box.clientWidth) {
        fontSize--;
        question.style.fontSize = fontSize + 'px';
    }

}
window.addEventListener('resize', adjustFontSize);

const radiosObjective = document.querySelectorAll('input[name="objective"]');
radiosObjective.forEach(radio => {
    radio.addEventListener('change', verificarSelecionado);
});

const radiosBinary = document.querySelectorAll('input[name="binary"]');
radiosBinary.forEach(radio => {
    radio.addEventListener('change', verificarSelecionado);
});

const textarea = document.getElementById("input-text");
textarea.addEventListener('input', verificarSelecionado);

textarea.addEventListener('input', function (e) {
    this.value = this.value.replace(/[^0-9]/g, '');
})

function verificarSelecionado() {


    const objectiveSelecionado = Array.from(radiosObjective).some(radio => radio.checked);
    const binarySelecionado = Array.from(radiosBinary).some(radio => radio.checked);

    if (objectiveSelecionado && perguntasSelecionadas[perguntaAtual].type != "quantitative" || binarySelecionado && perguntasSelecionadas[perguntaAtual].type != "quantitative") {
        botaoProximo.classList.add('active');
        botaoProximo.disabled = false;

    } else if (textarea.value != "") {
        botaoProximo.classList.add('active');
        botaoProximo.disabled = false;

    } else {
        botaoProximo.classList.remove('active');
        botaoProximo.disabled = true;
    }


}

botaoProximo.disabled = true;

// ----------------------------------------------------------------------------------------
// ==================================== Parte lógica ======================================
// ----------------------------------------------------------------------------------------
let perguntasSelecionadas = [];
let perguntaAtual = 0;
const progressBar = document.querySelectorAll('.progress-bar div');

const sectionObjective = document.querySelector(".objective");
const sectionDissertativa = document.querySelector(".dissertativa");
const sectionBinary = document.querySelector(".binary");


// Função para salvar a pergunta e a resposta
function salvarResposta(index, pergunta, resposta) {

    const categoria = pergunta.category;

    let pontuacao = JSON.parse(localStorage.getItem('pontuacoes')) || {};

    if (!pontuacao[categoria]) {
        pontuacao[categoria] = [];
    }

    pontuacao[categoria].push({
        index: index,
        pergunta: pergunta.question,
        resposta: resposta
    });

    localStorage.setItem('pontuacoes', JSON.stringify(pontuacao));

    // console.log(localStorage.getItem('pontuacoes'));

    // apagarDadosQuiz();
}


// ============================
// Função para gerar a pergunta
async function gerarPerguntas() {
    const pontuacoesSalvas = JSON.parse(localStorage.getItem('pontuacoes')) || {};


    let totalRespostas = 0;
    for (const categoria in pontuacoesSalvas) {
        totalRespostas += pontuacoesSalvas[categoria].length;
    }

    if (totalRespostas > 0) {
        perguntasSelecionadas = JSON.parse(localStorage.getItem('perguntas'));
        perguntaAtual = totalRespostas; 

        if (perguntaAtual < perguntasSelecionadas.length) {
            mostrarPergunta(perguntasSelecionadas[perguntaAtual]);
            return;
        }
    }

    const response = await fetch('../db/dados.json');
    const dados = await response.json();

    perguntasSelecionadas = [...selecionarPerguntasPorTipo(dados, "binary", 3, "Produto_Energia"),
        ...selecionarPerguntasPorTipo(dados, "binary", 1, "Produto_Energia"),
        ...selecionarPerguntasPorTipo(dados, "objective", 1, "Transporte"),
    ...selecionarPerguntasPorTipo(dados, "objective", 3, "Transporte"),
    ...selecionarPerguntasPorTipo(dados, "objective", 1, "Reciclagem"),
    ...selecionarPerguntasPorTipo(dados, "quantitative", 3, "Reciclagem")];

    if (localStorage.getItem('perguntas')) {
        localStorage.removeItem('perguntas')

        // console.log("oi");
        
    }

    localStorage.setItem('perguntas', JSON.stringify(perguntasSelecionadas));
    // console.log(localStorage.getItem('perguntas'));


    mostrarPergunta(perguntasSelecionadas[0]);

}

function selecionarPerguntasPorTipo(dados, tipo, quantidade, categoria) {
    const perguntasFiltradas = [];



    dados.questions.forEach(question => {
        if (question.type === tipo && question.category === categoria) {
            perguntasFiltradas.push(question);
        }
    });
    perguntasFiltradas.sort(() => Math.random() - 0.5);

    return perguntasFiltradas.slice(0, quantidade);
}

// ============================

// ==============================
// Função para mostrar a pergunta
function mostrarPergunta(perguntaSelecionada) {
    zerarRespostas(perguntaSelecionada);
    // console.log(perguntaSelecionada);

    if (perguntaSelecionada.type === "binary") {
        sectionBinary.classList.remove('disabled');
        sectionObjective.classList.add('disabled');
        sectionDissertativa.classList.add('disabled');

    } else if (perguntaSelecionada.type === "objective") {
        sectionObjective.classList.remove('disabled');
        sectionDissertativa.classList.add('disabled');
        sectionBinary.classList.add('disabled');
    } else {
        sectionDissertativa.classList.remove('disabled');
        sectionBinary.classList.add('disabled');
        sectionObjective.classList.add('disabled');


        if (perguntaSelecionada.unit === "dias" || perguntaSelecionada.unit === "km" || perguntaSelecionada.unit === "kg")
            textarea.placeholder = "Digite em (" + perguntaSelecionada.unit + ")"

    }

    question.innerHTML = perguntaSelecionada.question;
    adjustFontSize();

    // Atualiza a barra de progresso
    atualizarProgresso();

}

// Função para atualizar a barra de progresso
function atualizarProgresso() {
    progressBar.forEach((divProgress, index) => {
        if (index <= perguntaAtual) {
            divProgress.classList.add('progress');
        } else {
            divProgress.classList.remove('progress');
        }
    });
}

// Função para pegar a resposta
function getResposta(perguntaSelecionada) {
    if (perguntaSelecionada.type === "binary") {
        for (let option of radiosBinary) {
            if (option.checked) {
                return option.dataset.label;
            }
        }

    } else if (perguntaSelecionada.type === "objective") {
        for (let option of radiosObjective) {
            if (option.checked) {
                return option.dataset.label;
            }
        }

    } else {
        return textarea.value;
    }

    return undefined;
}

// Função para zerar as respostas
function zerarRespostas(perguntaSelecionada) {

    if (perguntaSelecionada.type === "binary") {
        radiosBinary.forEach(option => {
            option.checked = false
        });

    } else if (perguntaSelecionada.type === "objective") {
        radiosObjective.forEach(option => {
            option.checked = false
        });

    } else {
        textarea.value = "";

    }

    botaoProximo.classList.remove('active');
    botaoProximo.disabled = true;

}

botaoProximo.addEventListener("click", () => {

    salvarResposta(perguntaAtual, perguntasSelecionadas[perguntaAtual], getResposta(perguntasSelecionadas[perguntaAtual]))
    perguntaAtual++;

    // console.log(perguntaAtual);
    if (perguntaAtual <= 11) {

        mostrarPergunta(perguntasSelecionadas[perguntaAtual])
    } else {
        window.location.href = "resultados.html"
    }
})

gerarPerguntas();