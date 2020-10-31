<template>
  <div id="leftbar">
    <el-form class="ms-content">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="bar-btn">
            <el-button type="primary" v-on:click="goToService()" plain>
              Search for Service
            </el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="bar-btn">
            <el-button type="primary" v-on:click="goToOrders()" plain>My Orders</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="bar-btn">
            <el-button type="primary" v-on:click="goToPets()" plain>My Pets</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
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
      this.$router.push(path).catch((err) => {});
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
