<template>
    <el-menu class= "sidebar">
        <el-menu-item index="1" @click="linkClicked('/caretaker')">
            <template slot="title" >
              <i class="el-icon-s-home"></i>
              Care Taker Home
            </template>
        </el-menu-item>
        <el-menu-item index="2" @click="linkClicked('/caretaker/schedules')">
            <template slot="title" >
              <i class="el-icon-menu"></i>
              View Work Schedule
            </template>
        </el-menu-item>
        <el-menu-item index="3" @click="linkClicked('/caretaker/orders')">
            <template slot="title" >
              <i class="el-icon-s-order"></i>
              View All Orders
            </template>
        </el-menu-item>
        <el-menu-item index="4" @click="linkClicked('/caretaker/leaves')">
            <template slot="title">
              <i class="el-icon-s-claim"></i>
              Apply For Leaves
            </template>
            <!-- <template slot="title">
              <i class="el-icon-setting"></i>
              Add My Availability
            </template> -->
        </el-menu-item>
        <el-menu-item index="5" @click="linkClicked('/caretaker/stats')" >
            <template slot="title"><i class="el-icon-info"></i>View My Statistics</template>
        </el-menu-item>
    </el-menu>

</template>

<script>
export default {
  name: 'fulltime_caretaker_sidebar',
  methods: {
    linkClicked(route) {
      if (route !== this.$router.currentRoute.path) {
        this.$router.push(route);
      }
    },
  },
};
</script>

<style scoped>

</style>
