<template>
  <div class="leaves-container">
    <h1>Petowner Management</h1>
    <el-card>
      <el-table
        v-loading="listLoading"
        :data="list"
        :default-sort="{prop: 'username', order: 'ascending'}"
        element-loading-text="Loading"
        highlight-current-row
        border
        fit
      >
        <el-table-column sortable prop="username" label="username">
          <template slot-scope="scope">
            {{ scope.row.username }}
          </template>
        </el-table-column>
        <el-table-column sortable prop="deals" label="number of deals" width="200">
          <template slot-scope="scope">
            {{ scope.row.deals }}
          </template>
        </el-table-column>
        <el-table-column sortable prop="spending" label="spending" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.spending }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
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
      getPetowners().then(data => {
        this.list = data
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
.leaves {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
