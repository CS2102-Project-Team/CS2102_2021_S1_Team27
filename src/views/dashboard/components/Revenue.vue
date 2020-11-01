<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import { getRevenue } from '@/api/revenue'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
const animationDuration = 6000
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      data: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear() // 2020
      const currentMonth = currentDate.getMonth() // start from 0
      const toMonth = `${('0000' + currentYear).substr(-4)}-${('00' + (currentMonth + 1)).substr(-2)}`
      const fromMonth = `${('0000' + (currentMonth - 12 >= 0 ? currentYear : currentYear - 1)).substr(-4)}-${('00' + ((currentMonth + 12) % 12 + 1)).substr(-2)}`
      getRevenue({ from: fromMonth, to: toMonth }).then(data => {
        console.log('in revenue.vue')
        console.log(JSON.stringify(data))
        this.data = data
        const options = {
          title: {
            text: 'Revenue'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow' // 'line' | 'shadow'
            }
          },
          grid: {
            left: '5%',
            right: '5%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: data.map(x => x.month),
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            }
          }],
          series: [{
            name: 'Revenue',
            type: 'bar',
            barWidth: '60%',
            data: data.map(x => x.revenue),
            animationDuration
          }],
          color: [
            '#FF5733'
          ]
        }
        this.chart = echarts.init(this.$el, 'macarons')
        this.chart.setOption(options)
      })
    }
  }
}
</script>
