<template>
  <div id="leftbar">
    <el-menu class="sidebar">
      <el-menu-item index="1" @click="goToService()">
        <template slot="title" >
          <i class="el-icon-menu"></i>
          Search For Service
        </template>
      </el-menu-item>
      <el-menu-item index="2" @click="goToPets()">
        <template slot="title" >
          <i class="el-icon-menu"></i>
          View My Pets
        </template>
      </el-menu-item>
      <el-menu-item index="3" @click="goToOrders()">
        <template slot="title" >
          <i class="el-icon-menu"></i>
          View My Orders
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      homeMessage: 'Going back to the login homepage.',
      petMessage: 'Going to the pet information page.',
      serviceMessage: 'Going to the petowner landing page (service search page).',
      orderMessage: 'Going to the order information page.',
    };
  },
  methods: {
    navigation(message, path) {
      // eslint-disable-next-line no-console
      console.log(message);
      this.$router.push(path).catch(() => {});
    },
    goToPets() {
      this.navigation(this.petMessage, '/po/pets');
    },
    goToService() {
      this.navigation(this.serviceMessage, '/po');
    },
    goToOrders() {
      this.navigation(this.orderMessage, '/po/orders');
    },
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
