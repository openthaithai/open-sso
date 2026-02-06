<template>
    <main class="dashboard-container">
        <section class="premium-header">
            <div class="header-overlay"></div>
            <div class="container-md h-100 d-flex align-items-center position-relative">
                <img class="logo-img me-4" src="@/assets/images/logo_sso_white.png" width="120">
                <div class="header-content">
                    <h1 class="display-5 fw-bold text-white mb-1">เงินกองทุนประกันสังคมปี 2568</h1>
                    <p class="lead text-white-50 mb-0">สำนักงานประกันสังคม กระทรวงแรงงาน</p>
                </div>
            </div>
        </section>
        
        <section class="container-md content-section">
            <div class="row g-4 mb-5 mt-n5 position-relative">
                <div class="col-md-4">
                    <div class="stat-card">
                        <div class="stat-icon bg-primary-soft text-primary">
                            <i class="bi bi-wallet2"></i>
                        </div>
                        <div class="stat-details">
                            <h6 class="text-uppercase text-muted small fw-bold mb-1">งบประมาณรวมทั้งสิ้น</h6>
                            <h3 class="fw-bold mb-0">{{ formatNumber(totalBudget) }} <small class="fw-normal h6">บาท</small></h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="quick-nav d-flex align-items-center h-100 p-3 bg-white rounded-4 shadow-sm">
                        <div class="flex-grow-1">
                            <span class="text-muted small d-block mb-1">หมวดหมู่หลัก</span>
                            <div class="d-flex gap-2">
                                <span v-for="(root, index) in rootCategories" :key="index" class="badge-custom" :style="{ '--badge-color': root.color }">
                                    {{ root.name }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="chart-section" class="chart-wrapper rounded-5 shadow-lg overflow-hidden bg-white mb-5">
                <div class="chart-header p-4 border-bottom d-flex justify-content-between align-items-center bg-light-soft">
                    <div>
                        <h4 class="mb-0 fw-bold text-dark">โครงสร้างแผนงบประมาณประจำปี 2568</h4>
                        <p class="text-muted small mb-0">คลิกที่กล่องเพื่อดูรายละเอียดสัดส่วนงบประมาณในแต่ละแผนงาน</p>
                    </div>
                    <div class="chart-actions">
                        <button class="btn btn-primary-gradient rounded-pill px-4 btn-sm fw-bold shadow-sm" @click="resetChart">
                            <i class="bi bi-arrow-counterclockwise me-1"></i> เริ่มต้นใหม่
                        </button>
                    </div>
                </div>
                <div class="chart-container py-4 px-2">
                    <charts v-if="chartOptions" ref="chart" :options="chartOptions" />
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
// Import Libraries
import Highcharts from 'highcharts';

// Import Vues
import { ref, computed, onMounted, nextTick } from "vue";

// Import data
import jsonData from "@/assets/data/sso.json";

// States
const chartOptions = ref(null);
const totalBudget = ref(0);
const rootCategories = ref([]);

// onMounted
onMounted(() => {
    init();
})

// Functions
const formatNumber = (num) => {
    return new Intl.NumberFormat('th-TH').format(num);
}

const resetChart = () => {
    chartOptions.value = null;
    nextTick(() => {
        init();
        const element = document.getElementById('chart-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

const init = () => {
    let points = jsonData;
    
    // Calculate totals and root categories
    rootCategories.value = points.filter(p => p.parent === "0");
    totalBudget.value = rootCategories.value.reduce((acc, curr) => acc + curr.value, 0);

    // Modern Color Palette
    const premiumColors = ['#6366F1', '#06B6D4', '#F43F5E', '#8B5CF6', '#F59E0B', '#3B82F6'];

    // Create color map for root IDs
    const colorMap = {};
    rootCategories.value.forEach((root, idx) => {
        const color = premiumColors[idx % premiumColors.length];
        root.color = color;
        colorMap[root.id] = color;
    });

    // Propagate colors to children based on their root parent
    points.forEach(point => {
        if (point.parent !== "0") {
            const rootId = point.id.split('.')[0];
            if (colorMap[rootId]) {
                point.color = colorMap[rootId];
            }
        }
    });

    drawChart(points);
}

const drawChart = (points) => {
    chartOptions.value = {
        chart: {
            type: 'treemap',
            height: 700,
            backgroundColor: 'transparent',
            style: {
                fontFamily: "'Prompt', sans-serif"
            }
        },
        title: { text: null },
        subtitle: { text: null },
        credits: { enabled: false },
        legend: { enabled: false },
        tooltip: {
            useHTML: true,
            backgroundColor: '#FFFFFFFA',
            borderRadius: 12,
            borderWidth: 0,
            shadow: {
                color: '#0000001A',
                offsetX: 0,
                offsetY: 4,
                opacity: 1,
                width: 12
            },
            headerFormat: '',
            pointFormat: '<div class="custom-tooltip">' +
                         '<div class="tooltip-name">{point.name}</div>' +
                         '<div class="tooltip-value">งบประมาณ: <span class="amount">{point.value:,.0f}</span> <span class="unit">บาท</span></div>' +
                         '</div>',
            style: {
                padding: '0px'
            }
        },
        series: [{
            name: 'แผนงาน',
            layoutAlgorithm: 'squarified',
            allowDrillToNode: true,
            animationLimit: 1000,
            dataLabels: { enabled: false },
            levels: [{
                level: 1,
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    verticalAlign: 'top',
                    style: {
                        fontSize: '18px',
                        fontWeight: '700',
                        textOutline: 'none',
                        color: '#FFFFFF'
                    }
                },
                borderWidth: 4,
                borderColor: '#FFFFFF',
                levelIsConstant: false
            }, {
                level: 2,
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: '13px',
                        fontWeight: '600',
                        textOutline: 'none',
                        color: '#FFFFFFF2'
                    }
                },
                borderWidth: 1,
                borderColor: '#FFFFFF4D'
            }, {
                level: 3,
                dataLabels: { enabled: false },
                borderWidth: 1,
                borderColor: '#FFFFFF1A'
            }],
            accessibility: {
                exposeAsGroupOnly: true
            },
            colorByPoint: false,
            data: points
        }]
    }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
    min-height: 100vh;
}

.premium-header {
    height: 350px;
    background-image: url('@/assets/images/bg.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: relative;
    
    .header-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #00308FD9 0%, #1E40AF99 100%);
    }

    .logo-img {
        filter: drop-shadow(0 4px 6px #0000001A);
    }
}

.content-section {
    position: relative;
    z-index: 10;
}

.mt-n5 {
    margin-top: -80px !important;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 1.5rem;
    box-shadow: 0 10px 15px -3px #0000001A, 0 4px 6px -2px #0000000D;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    height: 100%;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-5px);
    }

    .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
    }

    .bg-primary-soft {
        background-color: #eef2ff;
    }
}

.badge-custom {
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
    background-color: var(--badge-color);
    display: inline-block;
    box-shadow: 0 2px 4px #0000001A;
}

.chart-wrapper {
    background: white;
    border: 1px solid #E2E8F0CC;
}

.bg-light-soft {
    background-color: #fcfdfe;
}

.chart-container {
    min-height: 700px; /* Stabilize height during reset */
}

.btn-primary-gradient {
    background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
    border: none;
    color: white;
    transition: all 0.3s ease;

    &:hover {
        background: linear-gradient(135deg, #4338ca 0%, #312e81 100%);
        box-shadow: 0 4px 12px #4F46E54D;
        transform: translateY(-1px);
    }
}

/* Tooltip Styles */
:deep(.custom-tooltip) {
    padding: 12px 16px;
    
    .tooltip-name {
        font-size: 14px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 6px;
        line-height: 1.4;
    }
    
    .tooltip-value {
        font-size: 12px;
        color: #64748b;
        
        .amount {
            font-size: 14px;
            font-weight: 700;
            color: #4f46e5;
            margin-left: 4px;
        }
        
        .unit {
            font-size: 11px;
            opacity: 0.8;
        }
    }
}

/* Highcharts Breadcrumbs Overrides */
:deep(.highcharts-breadcrumbs-button) {
    fill: #f8fafc !important;
    stroke: #e2e8f0 !important;
    
    text {
        fill: #475569 !important;
        font-weight: 600 !important;
    }
}

:deep(.highcharts-button-hover) {
    fill: #e2e8f0 !important;
}
</style>