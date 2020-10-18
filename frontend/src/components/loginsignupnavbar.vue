<template>
  <el-header>
    <el-row>
      <el-col :span="1" style="text-align: left;">
        Logo
      </el-col>
      <el-col :span="21" style="text-align: left;">
        Pet Anything
      </el-col>
      <el-col :span="2">
        <el-menu
          :default-active="activeIndex"
          class="headermenu"
          mode="horizontal"
          @select="handleSelect">
            <el-menu-item index="/login">Login</el-menu-item>
            <el-menu-item index="/signup">Signup</el-menu-item>
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

</style>
