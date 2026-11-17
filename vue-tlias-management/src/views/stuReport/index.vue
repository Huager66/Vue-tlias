<script setup>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import { studentCountDataApi, studentDegreeDataApi } from '@/api/empReport'

const chartRef = ref()

const genderRef = ref()
onMounted(async () => {
  const myChart = echarts.init(chartRef.value, genderRef.value)
  const res = await studentCountDataApi()
  xAxis.value = res.data.clazzList
  series.value = res.data.dataList

  myChart.setOption({
    xAxis: {
      type: 'category',
      data: xAxis.value,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: series.value,
        type: 'bar',
      },
    ],
  })

  const res1 = await studentDegreeDataApi()
  one.value = res1.data

  console.log(one.value)
  const myChart1 = echarts.init(genderRef.value)
  myChart1.setOption({
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: one.value,
      },
    ],
  })
})

const xAxis = ref([])
const series = ref([])
const one = ref([])
</script>
<template>
  <div class="container">
    <div ref="chartRef" class="n" style="width: auto; height: 600px"></div>
    <div ref="genderRef" class="n" style="width: auto; height: 600px"></div>
  </div>
</template>
<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 100vh;
  padding: 20px;
}
.n {
  flex: 1;
  height: 100%;
}
</style>
