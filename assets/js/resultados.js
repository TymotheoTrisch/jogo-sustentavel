var dom = document.getElementById('chart-container');
var myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
});
var app = {};

// Opção para o gráfico do Desktop (Gráfico de Rosas)
var optionDesktop = {
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
    tooltip: {
        trigger: 'item',
        formatter: function(params) {
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
    var chartContainer = document.getElementById('chart-container');
    
    if (window.innerWidth < 1240) {
        myChart.setOption(optionMobile);
    } else {
        myChart.setOption(optionDesktop);
    }
}

// Chamar a função ao carregar a página
setResponsiveChart();

// Redimensionar o gráfico ao mudar o tamanho da janela
window.addEventListener('resize', function() {
    myChart.resize(); // Ajusta o gráfico ao tamanho do container
    setResponsiveChart(); // Verifica novamente o tipo de gráfico
});
