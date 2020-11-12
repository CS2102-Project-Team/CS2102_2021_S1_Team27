<template>
  <el-card shadow="hover" class="card">
    <div slot="header" class="clearfix">
      <span>Featured Petowners</span>
    </div>
    <div v-for="o in list" :key="o.username" class="text item">
      <i class="el-icon-s-goods" style="color:FUCHSIA" />
      <span style="color: ORANGERED;">{{ `${o.username}` }}</span>
      {{ `spent $${o.spending.toFixed(2)} this month!` }}
    </div>
  </el-card>
</template>

<script>
import { getPetowners } from '@/api/userManagement'
export default {
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getPetowners().then(
        data => data.map(x => {
          x.spending = x.spending ? x.spending : 0
          return x
        })
      ).then(data => {
        this.list = data
        this.list.sort((a, b) => b.spending - a.spending)
        this.list = this.list.slice(0, 7)
        this.listLoading = false
        if (!data.length) {
          this.$alert('No petowners found!', 'Note', {
            confirmButtonText: 'OK'
          })
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('Oops, err fetching petowners')
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .card {
    width: 320px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
</style>
