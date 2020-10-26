<template>
  <div>
    <leftbar/>
    <el-card class='box-card' v-for="(order,index) in orders" v-bind:key="index">
      <div class='text'>{{ 'Pet Name: ' + order.pname }}</div>
      <div class='text'>{{ 'Caretaker Username: ' + order.ctaker }}</div>
      <div class='text'>{{ 'Start Date: ' + order.sdate }}</div>
      <div class='text'>{{ 'End Date: ' + order.edate }}</div>
      <div class='text'>{{ 'Delivery Mode: ' + order.delivery }}</div>
      <div class='text'>{{ 'Status: ' + order.status }}</div>
    </el-card>
  </div>
</template>

<script>
import { searchOrder } from '@/api/petowner';
import leftbar from './components/leftbar.vue';

export default {
  data() {
    return {
      orders: [],
    };
  },
  methods: {
    getOrders() {
      searchOrder().then((results) => {
        this.orders = results.data;
      }).catch((err) => {
        this.$notify({
          title: 'Get Orders Info Failed.',
          message: err.response.status,
          duration: 0,
        });
      });
    },
  },
  components: {
    leftbar,
  },
  beforeMount() {
    this.getOrders();
  },
};
</script>

<style scoped>
.text {
  font-size: 18px;
}

.box-card {
  width: 480px;
}
</style>
