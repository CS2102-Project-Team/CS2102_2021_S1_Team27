<template>
  <div class="leaves-container">
    <h1>Leave Applications</h1>
    <el-card>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        highlight-current-row
        border
        fit
      >
        <el-table-column sortable prop="caretakerusername" label="caretaker" width="120">
          <template slot-scope="scope">
            {{ scope.row.caretakerusername }}
          </template>
        </el-table-column>
        <el-table-column label="start date">
          <template slot-scope="scope">
            {{ scope.row.startdate }}
          </template>
        </el-table-column>
        <el-table-column label="end date">
          <template slot-scope="scope">
            <span>{{ scope.row.enddate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Clash?" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.clash }}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="Status" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" class-name="status-col" label="Action" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.status==='pending'">
              <el-tag type="info" @click="updateLeave(scope.row, true)">Approve</el-tag>
              <el-tag type="warning">Reject</el-tag>
            </div>
            <div v-else>
              <i class="el-icon-platform-eleme" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getLeave, putLeave } from '@/api/leave'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
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
      getLeave({ include_history: true }).then(data => {
        this.list = data
        this.listLoading = false
        if (!data.length) {
          this.$alert('No leave applications found!', 'Note', {
            confirmButtonText: 'OK'
          })
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('Oops, err fetching leave applications')
        this.listLoading = false
      })
    },
    updateLeave(row, approve) {
      const { caretakerusername, startdate, enddate } = row
      putLeave({
        caretakerusername,
        startdate,
        enddate,
        approve
      }).then(() => {
        this.$message({
          message: 'Application status successfully updated',
          type: 'success'
        })
      }).catch(error => {
        this.$message.error(`Oops, application status not updated :< ${error}`)
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
