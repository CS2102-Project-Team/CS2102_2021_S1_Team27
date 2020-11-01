<template>
  <div class="pricing-container">
    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>Dog</span>
      </div>
      <el-form ref="form" :model="form" label-width="120px">
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 1:</span>
          <el-input v-model="form.dog1" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit">Update</el-button>
        </div>
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 2:</span>
          <el-input v-model="form.dog2" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit">Update</el-button>
        </div>
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 3:</span>
          <el-input v-model="form.dog3" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit">Update</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>Cat</span>
      </div>
      <el-form ref="form" :model="form" label-width="120px">
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 1:</span>
          <el-input v-model="form.cat1" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit">Update</el-button>
        </div>
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 2:</span>
          <el-input v-model="form.cat2" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit">Update</el-button>
        </div>
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 3:</span>
          <el-input v-model="form.cat3" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit">Update</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>Fish</span>
      </div>
      <el-form ref="form" :model="form" label-width="120px">
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 1:</span>
          <el-input v-model="form.fish1" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit">Update</el-button>
        </div>
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 2:</span>
          <el-input v-model="form.fish2" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit">Update</el-button>
        </div>
        <div class="inputRow">
          <span style="display: inline-block; width: 80px;">Class 3:</span>
          <el-input v-model="form.fish3" style="width: 180px;" />
          <el-button type="primary" class="updateBtn" @click="onSubmit">Update</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {},
    onSubmit() {
      console.log('submit!')
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
