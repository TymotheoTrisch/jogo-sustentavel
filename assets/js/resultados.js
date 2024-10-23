var dom = document.getElementById('chart-container');
var myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
});
var app = {};

var option;

option = {
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
    xAxis: [
        {
            type: 'category',
            data: ['Reciclagem', 'P&E', 'Transporte'],
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                fontSize: 10
            }
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: {
        type: 'bar',
        barWidth: '50%',
        data: [
            { value: 10, name: "Reciclagem" }, 
            { value: 52, name: "Prod. & Energ" }, 
            { value: 65, name: "Transporte" }
        ],
        itemStyle: {
            color: '#73a373',
        }
        // color: [
        //     '#dd6b66',
        //     '#759aa0',
        //     '#e69d87',
        //     '#8dc1a9',
        //     '#ea7e53',
        //     '#eedd78',
        //     '#73a373',
        //     '#73b9bc',
        //     '#7289ab',
        //     '#91ca8c',
        //     '#f49f42'
        //   ]
    }
};

if (option && typeof option === 'object') {
    myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);
