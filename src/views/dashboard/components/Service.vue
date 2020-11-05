<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import { getService } from '@/api/service'
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
      getService({ from: fromMonth, to: toMonth }).then(data => {
        console.log(`in service.vue: ${JSON.stringify(data)}`)
        this.data = data
        const options = {
          title: {
            text: 'Service'
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
          series: ['cat', 'dog', 'fish'].map(petcategory => {
            return {
              name: petcategory,
              type: 'bar',
              barWidth: '60%',
              stack: 'vistors',
              data: data.map(x => x.pethour[petcategory]),
              animationDuration
            }
          }),
          color: [
            '#16A085', '#3498DB', '#2E4053'
          ]
        }
        this.chart = echarts.init(this.$el, 'macarons')
        this.chart.setOption(options)
      })
    }
  }
}
</script>
