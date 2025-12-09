<template>
    <main>
        <section class="header-section d-flex align-items-center mb-3">
            <img class="px-4 py-3" src="@/assets/images/logo_sso_white.png" width="100">
        </section>
        
        <section class="container-md">
            <div class="text-center">
                <h3>เงินกองทุนเพื่อบริหารงานสำนักงานประกันสังคมปี 2568</h3>
            </div>
            <div>
                <charts ref="chart" :options="chartOptions" />
            </div>
        </section>
    </main>
</template>

<script setup>
// Import Libraries
import Highcharts from 'highcharts';

// Import Vues
import { ref, computed, onMounted } from "vue";

// Import data
import jsonData from "@/assets/data/sso.json";

// States
const chartOptions = ref({});

// onMounted
onMounted(() => {
    init();
})

// Functions
const init = () => {
    let points = jsonData;

    chartOptions.value =  {
        chart: {
            type: 'treemap',
            height: 650,
            scrollablePlotArea:  {                          
                scrollPositionY: 0
            } 
        },
        title: {
            enabled: false
        },
        series: [{
            name: 'แผนงาน',
            layoutAlgorithm: 'squarified',
            allowDrillToNode: true,
            animationLimit: 1000,
            dataLabels: {
                enabled: false
            },
            levels: [{
                level: 1,
                dataLabels: {
                    enabled: true
                },
                borderWidth: 3,
                levelIsConstant: false
            }, {
                level: 1,
                dataLabels: {
                    style: {
                        fontSize: '14px'
                    }
                }
            }],
            accessibility: {
                exposeAsGroupOnly: true
            },
            colorByPoint: true,
            breadcrumbs: {
                showFullPath: false
            },
            data: points
        }]
    }
}
</script>

<style lang="scss" scoped>
.header-section {
    background-image: url('@/assets/images/bg.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}
</style>