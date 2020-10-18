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
            <el-menu-item index="logout" class="ral">Log out</el-menu-item>
            <el-menu-item index="/caretaker" class="ral">Care Taker</el-menu-item>
            <el-menu-item index="/petowner" class="ral">Pet Owner</el-menu-item>
            <el-menu-item index="/profile" class="ral">Profile</el-menu-item>
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
      if (key.substr(0, 1) === '/') {
        this.$router.push(key);
      } else if (key === 'logout') {
        this.$store.dispatch('logout')
          .then(() => {
            this.$router.push('/');
          })
          .catch(({ error }) => {
            // eslint-disable-next-line no-console
            console.log(error);
          });
      }
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
