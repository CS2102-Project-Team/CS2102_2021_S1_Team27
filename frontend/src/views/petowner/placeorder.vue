<template>
  <div>
    <leftbar/>
    <el-card class='box-card'>
      <div class='text item'>{{ 'Name: ' + param.caretakername }}</div>
      <br/>
      <div class='text item' v-if="param.fulltime">{{ 'Full Time Care Taker' }}</div>
      <div class='text item' v-else>{{ 'Part Time Care Taker' }}</div>
      <br/>
      <div class='text item'>{{ 'Rating: ' + param.caretakername }}</div>
      <br/>
      <div class='text item'>{{ 'Start date: ' + param.startdate }}</div>
      <br/>
      <div class='text item'>{{ 'End date: ' + param.enddate }}</div>
    </el-card>
    <el-button type="primary" v-on:click="goToAddPet()">Place Order</el-button>
  </div>
</template>

<script>
import leftbar from './components/leftbar.vue';

export default {
  data() {
    return {
      rating: '',
      fulltime: false,
      param: {
        petname: '',
        caretakername: '',
        startdate: '',
        enddate: '',
        paymentmethod: '',
        deliverymode: '',
      },
    };
  },
  components: {
    leftbar,
  },
};
</script>

<style scoped>
.text {
  font-size: 20px;
}

.item {
  margin-bottom: 12px;
}

.box-card {
  width: 480px;
}
</style>
