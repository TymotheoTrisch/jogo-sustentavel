async function obterDadosCalculo() {
    // Aguarda a execução de `calcularRespostas` e recebe o resultado.
    const resultados = await calcularRespostas();

    return resultados;
}

// Função para apagar os dados do quiz
function apagarForm() {
    localStorage.removeItem('pontuacoes');

    console.log("Dados do quiz apagados:", localStorage.getItem('pontuacoes') === null);

    window.location.href = "../../index.html"
}

// Função para apagar e refazer os dados do quiz
function refazerForm() {
    localStorage.removeItem('pontuacoes');

    console.log("Dados do quiz apagados:", localStorage.getItem('pontuacoes') === null);

    window.location.href = "pergunta.html"
}

async function textoEImagem() {
    try {
        const dados = await obterDadosCalculo();
        
        const tituloFinal = document.getElementById('titulo');
        const imgFinal = document.getElementById('img-final');
        const fraseFinalM = document.getElementById('frase-final-mobile');
        const fraseFinalD = document.getElementById('frase-final-desktop');
        
        
        if(dados.pontuacaoTotal < 4) {
            tituloFinal.innerText = "Você precisa melhorar!";
            imgFinal.src = "../images/imagem_final_pessimo.svg";
            fraseFinalM.innerText = "Obrigado por participar! Há várias áreas em que você pode melhorar suas práticas sustentáveis. Melhore a cada dia!";
            fraseFinalD.innerText = "Obrigado por participar! Há várias áreas em que você pode melhorar suas práticas sustentáveis. Melhore a cada dia!";
        } else if(dados.pontuacaoTotal < 8) {
            tituloFinal.innerText = "Você está quase lá!";
            imgFinal.src = "../images/imagem_final_mediano.svg";
            fraseFinalM.innerText = "Bom trabalho! Seus hábitos são sustentáveis em muitas áreas, mas há algumas oportunidades de melhoria. Aprimore elas!";
            fraseFinalD.innerText = "Bom trabalho! Seus hábitos são sustentáveis em muitas áreas, mas há algumas oportunidades de melhoria. Aprimore elas!";
        } else {
            tituloFinal.innerText = "Você foi muito bem!";
            imgFinal.src = "../images/imagem_final_bom.svg";
            fraseFinalM.innerText = "Parabéns! Você tem ótimos hábitos que contribuem positivamente para o meio ambiente. Continue assim!";
            fraseFinalD.innerText = "Parabéns! Você tem ótimos hábitos que contribuem positivamente para o meio ambiente. Continue assim!";
        }
    } catch (error) {
        console.log("Error: " + error);
        
    }
}

async function renderizarGraficos() {
    try {

        const dados = await obterDadosCalculo();

        const acertosPorCategoria = dados.acertosPorCategoria;
        const resultadosPorCategoria = dados.resultadosPorCategoria;
        const total = dados.pontuacaoTotal;
        
        var chartPontuacaoPorCategoriaGeral = document.getElementById('chart-categoria');
        var chartPontuacao = echarts.init(chartPontuacaoPorCategoriaGeral, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        // Opção para o gráfico do Desktop (Gráfico de Rosas)
        var optionDesktop = {
            title: {
                text: 'Pontuação por Categoria',
                left: 'center',
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: 'bottom',
                left: 'center'
            },
            series: [
                {
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    padAngle: 5,
                    itemStyle: {
                        borderRadius: 10
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 27,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: resultadosPorCategoria.Reciclagem, name: 'Reciclagem' },
                        { value: resultadosPorCategoria.Produto_Energia, name: 'Prod. & Energ' },
                        { value: resultadosPorCategoria.Transporte, name: 'Transporte' }
                    ]
                }
            ]
        };

        // Opção para o gráfico Mobile (Gráfico de Barras)
        var optionMobile = {
            title: {
                text: 'Pontuação por Categoria',
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return `<div>
                      <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>
                      ${params.data.name} <strong style="margin-left: 5px">${params.value}</strong>
                    </div>`;
                },
                backgroundColor: '#fff',
                textStyle: {
                    color: '#636060',
                    fontSize: 14
                },
            },
            grid: {
                left: '0%',
                right: '0%',
                bottom: '5%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['Reciclagem', 'P&E', 'Transporte'],
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                    fontSize: 10
                }
            },
            yAxis: {
                type: 'value'
            },
            series: {
                type: 'bar',
                barWidth: '50%',
                data: [
                    { value: resultadosPorCategoria.Reciclagem, name: 'Reciclagem' },
                    { value: resultadosPorCategoria.Produto_Energia, name: 'Prod. & Energ' },
                    { value: resultadosPorCategoria.Transporte, name: 'Transporte' }
                ],
                itemStyle: {
                    color: '#73a373'
                }
            }
        };

        // Função para selecionar o gráfico correto com base na largura da tela
        function setResponsiveChart() {

            if (window.innerWidth < 1024) {
                chartPontuacao.setOption(optionMobile);
            } else {
                chartPontuacao.setOption(optionDesktop);
            }
        }

        setResponsiveChart();

        window.addEventListener('resize', function () {
            chartPontuacao.resize();
            setResponsiveChart();
        });


        
        // Configuração do gráfico de pizza
        const maxPontuacao = 12;

        const optionPontuacaoTotal = {
            title: {
                text: 'Pontuação Total',
                left: 'center'
            },
            tooltip: { show: false },
            series: [{
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: { show: false },
                data: [
                    {
                        value: total,
                        name: 'Sustentabilidade',
                        itemStyle: { color: '#73a373' }
                    },
                    {
                        value: maxPontuacao - total ,
                        name: 'Restante',
                        itemStyle: { color: '#e0e0e0' }
                    }
                ]
            }]
        };


        const chartPontuacaoTotal = echarts.init(document.getElementById('chart-pontuacao-total'));
        chartPontuacaoTotal.setOption(optionPontuacaoTotal);

        window.addEventListener('resize', function () {
            chartPontuacaoTotal.resize();
        });

        // Gráfico pontuação de acertos e erros
        const optionPontuacaoPorCategoria = {
            title: {
                text: 'Pontuação de acertos por categoria',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                top: 'bottom',

            },
            grid: {
                left: '1%',
                right: '0%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: ['Reciclagem', 'P&E', 'Transporte']
            },
            series: [
                {
                    name: 'Acertos',
                    type: 'bar',
                    data: [acertosPorCategoria.Reciclagem.corretas, acertosPorCategoria.Produto_Energia.corretas, acertosPorCategoria.Transporte.corretas],
                    itemStyle: { color: '#73a373' }
                },
                {
                    name: 'Erros',
                    type: 'bar',
                    data: [acertosPorCategoria.Reciclagem.incorretas, acertosPorCategoria.Produto_Energia.incorretas, acertosPorCategoria.Transporte.incorretas],
                    itemStyle: { color: '#e0e0e0' }
                }
            ]
        };

        // Inicializa e renderiza o gráfico
        const chartPontuacaoAcertos = echarts.init(document.getElementById('chart-pontuacao-acertos'));
        chartPontuacaoAcertos.setOption(optionPontuacaoPorCategoria);

        window.addEventListener('resize', function () {
            chartPontuacaoAcertos.resize();
        });
    } catch (error) {
        console.error("Erro ao renderizar gráficos:", error);
    }
}

textoEImagem();
renderizarGraficos();