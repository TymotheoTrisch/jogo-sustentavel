var dom = document.getElementById('chart-categoria');
var myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
});
var app = {};

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
                { value: 10, name: 'Reciclagem' },
                { value: 52, name: 'Prod. & Energ' },
                { value: 65, name: 'Transporte' }
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
            { value: 10, name: "Reciclagem" },
            { value: 52, name: "Prod. & Energ" },
            { value: 65, name: "Transporte" }
        ],
        itemStyle: {
            color: '#73a373'
        }
    }
};

// Função para selecionar o gráfico correto com base na largura da tela
function setResponsiveChart() {

    if (window.innerWidth < 1024) {
        myChart.setOption(optionMobile);
    } else {
        myChart.setOption(optionDesktop);
    }
}

setResponsiveChart();

window.addEventListener('resize', function () {
    myChart.resize();
    setResponsiveChart();
});




// Gráfico geral
const pontuacaoTotal = 7;
const maxPontuacao = 10;

// Configuração do gráfico de pizza
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
                value: pontuacaoTotal,
                name: 'Sustentabilidade',
                itemStyle: { color: '#73a373' }
            },
            {
                value: maxPontuacao - pontuacaoTotal,
                name: 'Restante',
                itemStyle: { color: '#e0e0e0' }
            }
        ]
    }]
};


const chartPontuacaoTotal = echarts.init(document.getElementById('chart-pontuacao-total'));
chartPontuacaoTotal.setOption(optionPontuacaoTotal);

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
            data: [2, 1, 1],
            itemStyle: { color: '#73a373' }
        },
        {
            name: 'Erros',
            type: 'bar',
            data: [2, 2, 2],
            itemStyle: { color: '#e0e0e0' }
        }
    ]
};

// Inicializa e renderiza o gráfico
const chartPontuacaoAcertos = echarts.init(document.getElementById('chart-pontuacao-acertos'));
chartPontuacaoAcertos.setOption(optionPontuacaoPorCategoria);
