<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>不如鬼畜</span>
      <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
    </div>
    <div v-for="o in 4" :key="o" class="text item">
      {{ "列表内容 " + o }}
    </div>
    <div>
      <el-button type="primary" @click="logout()">Sign out</el-button>
    </div>
    <el-button v-on:click="goToPO()">Pet Owner Page</el-button>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      loggedin: !!this.$store.getters.token,
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
        .then(() => {
          this.$message.success('Sign out successful!');
          this.$router.push('/login');
        }).catch((error) => {
          this.$message.error(error);
        });
    },
    goToPO() {
      console.log('Entering the petowner page.');
      this.$router.push('/po');
    },
  },
};
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>
