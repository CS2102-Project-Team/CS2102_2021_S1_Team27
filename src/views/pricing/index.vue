<template>
  <div class="pricing-container">
    <h1>Pricing Management</h1>
    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>Dog</span>
      </div>
      <el-form ref="form" v-loading="loading" :model="form" label-width="120px">
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 1:</span>
          <el-input v-model="form.dog1" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit('dog1')">Update</el-button>
        </div>
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 2:</span>
          <el-input v-model="form.dog2" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit('dog2')">Update</el-button>
        </div>
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 3:</span>
          <el-input v-model="form.dog3" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit('dog3')">Update</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>Cat</span>
      </div>
      <el-form ref="form" v-loading="loading" :model="form" label-width="120px">
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 1:</span>
          <el-input v-model="form.cat1" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit('cat1')">Update</el-button>
        </div>
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 2:</span>
          <el-input v-model="form.cat2" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit('cat2')">Update</el-button>
        </div>
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 3:</span>
          <el-input v-model="form.cat3" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit('cat3')">Update</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>Fish</span>
      </div>
      <el-form ref="form" v-loading="loading" :model="form" label-width="120px">
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 1:</span>
          <el-input v-model="form.fish1" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit('fish1')">Update</el-button>
        </div>
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 2:</span>
          <el-input v-model="form.fish2" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit('fish2')">Update</el-button>
        </div>
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 3:</span>
          <el-input v-model="form.fish3" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit('fish3')">Update</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getPrice, putPrice } from '@/api/price'
export default {
  data() {
    return {
      form: {
        dog1: '',
        dog2: '',
        dog3: '',
        cat1: '',
        cat2: '',
        cat3: '',
        fish1: '',
        fish2: '',
        fish3: ''
      },
      loading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      getPrice().then(data => {
        data.forEach(element => {
          switch (element.category) {
            case 'dog':
              this.form.dog1 = element.price1
              this.form.dog2 = element.price2
              this.form.dog3 = element.price3
              break
            case 'cat':
              this.form.cat1 = element.price1
              this.form.cat2 = element.price2
              this.form.cat3 = element.price3
              break
            case 'fish':
              this.form.fish1 = element.price1
              this.form.fish2 = element.price2
              this.form.fish3 = element.price3
              break
          }
        })
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.$message.error('Oops, err fetching prices')
        this.loading = false
      })
    },
    onSubmit(key) {
      console.log('submited!')
      const data = {
        category: key.substr(0, 3),
        classes: parseInt(key.substr(-1)),
        price: parseInt(this.form[key])
      }
      putPrice(data).then(() => {
        this.$message({
          message: 'Price successfully updated',
          type: 'success'
        })
      }).catch(error => {
        this.$message.error(`Oops, price not updated :< ${error}`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pricing {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.card {
  margin-bottom: 30px;
}
.updateBtn {
  margin-left: 10px;
}
.inputRow {
  margin-bottom: 10px;
}
</style>
