<template>
  <el-header>
    <el-row>
      <el-col :span="1" style="text-align: left;">
        Logo
      </el-col>
      <el-col :span="15" style="text-align: left;">
        Pet Anything
      </el-col>
      <el-col :span="8">
        <el-menu
          :default-active="activeIndex"
          class="headermenu"
          mode="horizontal"
          @select="handleSelect">
            <el-menu-item index="/signup" class = 'ral'>Signup</el-menu-item>
            <el-menu-item index="/login" class = 'ral'>Login</el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>

export default {
  name: 'navbar',
  data() {
    return {
      activeIndex: '0',
    };
  },
  methods: {
    handleSelect(key) {
      this.$router.push(key);
    },
  },
};
</script>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .headermenu {
    background-color: #B3C0D1;
  }
  .ral {
    float: right !important;
  }
</style>
