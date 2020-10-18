<template>
  <div id="leftbar">
    <el-card>
      <div class="bar-btn">
        <el-button v-on:click="goToHome()">Home</el-button>
      </div>
      <div class="bar-btn">
        <el-button v-on:click="goToService()">Search for Service</el-button>
      </div>
      <div class="bar-btn">
        <el-button v-on:click="goToOrders()">My Orders</el-button>
      </div>
      <div class="bar-btn">
        <el-button v-on:click="goToPets()">My Pets</el-button>
      </div>
    </el-card>
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
      this.$router.push(path).catch(err => {});
    },
    goToHome() {
      this.navigation(this.homeMessage, '/home');
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
