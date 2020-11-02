<template>
  <div class="dashboard-container">
    <div class="dashboard-text" style="margin-bottom:60px;">name: {{ name }}</div>
    <el-row :gutter="100" style="margin-bottom:30px;">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <revenue />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <service />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="36" style="margin-bottom:30px;">
      <el-col :xs="24" :sm="12" :md="12" :lg="8">
        <featured-caretakers />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="8">
        <featured-petowners />
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="8">
        <todo-list />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TodoList from './components/TodoList'
import Revenue from './components/Revenue'
import Service from './components/Service'
import FeaturedCaretakers from './components/FeaturedCaretakers'
import FeaturedPetowners from './components/FeaturedPetowners'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'Dashboard',
  components: {
    TodoList,
    Revenue,
    Service,
    FeaturedCaretakers,
    FeaturedPetowners
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
