<template>
  <el-card shadow="hover" class="card">
    <div slot="header" class="clearfix">
      <span>Featured Caretakers</span>
    </div>
    <div v-for="o in list" :key="o" class="text item">
      <i class="el-icon-star-on" style="color:CORAL" />
      {{ `${o.username} earned $${o.salary} this month!` }}
    </div>
  </el-card>
</template>

<script>
import { getCaretakers } from '@/api/userManagement'
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
      getCaretakers().then(data => {
        this.list = data
        this.list.sort((a, b) => b.salary - a.salary)
        this.list = this.list.slice(0, 7)
        this.listLoading = false
        if (!data.length) {
          this.$alert('No caretakers found!', 'Note', {
            confirmButtonText: 'OK'
          })
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('Oops, err fetching caretakers')
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
