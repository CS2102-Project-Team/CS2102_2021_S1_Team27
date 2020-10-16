<template>
  <div>
    <el-card class="box-card" height="100%">
      <div slot="header" class="clearfix">
        <span>Liang Boyuan</span>
      </div>
      <div class="bar-btn">
        <el-button type="primary" plain>search for service</el-button>
      </div>
      <div class="bar-btn">
        <el-button type="primary" plain>my pets</el-button>
      </div>
      <div class="bar-btn">
        <el-button type="primary" plain>my orders</el-button>
      </div>
      <div class="bar-btn">
        <el-button type="primary" plain>back to home</el-button>
      </div>
    </el-card>

    <el-form :model="param" :rules="rules" class="ms-content">
      <el-row>
        <el-col span=4>
          <el-form-item prop="startdate">
            <el-input v-model="param.startdate" placeholder="startdate">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col span=4>
          <el-form-item prop="enddate">
            <el-input v-model="param.enddate" placeholder="enddate">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col span=4>
          <el-form-item prop="category">
            <el-input v-model="param.category" placeholder="category">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col span=4>
          <el-form-item>
            <div class="bar-btn">
              <el-button type="primary">search</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>
export default {
  data() {
    return {
      param: {
        startdate: '',
        enddate: '',
        category: '',
      },
      rules: {
        startdate: [{ required: true, message: 'Please specify your start date', trigger: 'blur' }],
        enddate: [{ required: true, message: 'Please specify your end date', trigger: 'blur' }],
        category: [{ required: true, message: 'Please specify your pet category', trigger: 'blur' }],
      },
      loading: false,
    };
  },
  methods: {
  },
};
</script>

<style>
.ms-content {
  padding: 30px 30px;
}
.bar-btn {
  text-align: center;
  font-size: 2rem;
}
.bar-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
</style>
