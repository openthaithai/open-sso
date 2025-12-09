import Highcharts from "highcharts";
import TreeMapFactory from "highcharts/modules/treemap";
import HeatMapFactory from "highcharts/modules/heatmap";

Highcharts.theme = {
    chart: {
        backgroundColor: 'transparent',
        style: {
            fontFamily: "'Prompt', sans-serif"
        },
    },
    title: {
        style: {
            display: 'none'
        }
    },
    subtitle: {
        style: {
            display: 'none'
        }
    },
    legend: {
        style: {
            display: 'none'
        }
    },
    credits: {
        style: {
            display: 'none'
        }
    },
    lang: {
        decimalPoint: '.',
        thousandsSep: ',',
        numericSymbols: ["K", "M", "G", "T", "P", "E"]
    },
};
Highcharts.setOptions(Highcharts.theme);
TreeMapFactory(Highcharts);
HeatMapFactory(Highcharts);