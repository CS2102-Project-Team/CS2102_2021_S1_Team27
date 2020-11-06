<template>
  <div class="leaves-container">
    <h1>Caretaker Management</h1>
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
        <el-table-column sortable prop="username" label="username" width="120">
          <template slot-scope="scope">
            {{ scope.row.username }}
          </template>
        </el-table-column>
        <el-table-column sortable prop="name" label="name" width="200">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="address">
          <template slot-scope="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column sortable prop="rating" label="rating" width="120">
          <template slot-scope="scope">
            <span>{{ parseFloat(scope.row.rating) > -1 ? parseFloat(scope.row.rating).toFixed(1) : 'No rating' }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable prop="salary" label="salary" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.salary }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable prop="fulltime" label="fulltime?" width="120">
          <template slot-scope="scope">
            <i v-if="scope.row.fulltime" class="el-icon-check" />
            <i v-else class="el-icon-close" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" class-name="status-col" label="Action" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.fulltime==false">
              <el-tag class="hand tag" effect="dark" @click="promoteUser(scope.row.username)">Promote</el-tag>
            </div>
            <div v-else>
              <el-tag class="tag" type="info" effect="plain">
                <i class="el-icon-platform-eleme" />
              </el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getCaretakers, promote } from '@/api/userManagement'
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
    },
    promoteUser(caretaker) {
      promote({
        caretaker
      }).then(() => {
        this.$message({
          message: 'Caretaker promoted',
          type: 'success'
        })
      }).catch(error => {
        this.$message.error(`Oops, caretaker not promoted :< ${error}`)
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
.hand {
  cursor: pointer;
}
.tag {
  width: 70px;
  text-align: center;
}
</style>
