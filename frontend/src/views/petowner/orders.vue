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
      <span>
        <el-button v-if="canGiveRating(order)" v-on:click="order.ratingVisible=true">
          Give Rating
        </el-button>
        <el-button v-if="canMakePayment(order)" v-on:click="order.paymentVisible=true">
          Make Payment
        </el-button>
      </span>
      <el-dialog title='Give Rating' :visible.sync="order.ratingVisible" width="50%">
        <div class='text'>Rating</div>
        <br/>
        <el-select v-model="param.rating" placeholder="--select-rating--">
          <el-option v-for="(mark,index) in [1,2,3,4,5]" :key="index"
          :label="mark" :value="mark">
          </el-option>
        </el-select>
        <br/>
        <div class='text'>Feedback</div>
        <br/>
        <el-input v-model="param.feedback">
          <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
        </el-input>
        <span>
          <el-button type="primary" v-on:click="placeRating(order)">Confirm</el-button>
          <el-button v-on:click="order.ratingVisible=false">Cancel</el-button>
        </span>
      </el-dialog>
      <el-dialog title='Make payment' :visible.sync="order.paymentVisible" width="50%">
        <div class='text'>Select Card</div>
        <br/>
        <span>
          <el-button type="primary" v-on:click="order.paymentVisible=false">Confirm</el-button>
          <el-button v-on:click="order.paymentVisible=false">Cancel</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { searchOrder, giveRating } from '@/api/petowner';
import leftbar from './components/leftbar.vue';

export default {
  data() {
    return {
      orders: [],
      param: {
        petname: '',
        caretakerusername: '',
        startdate: '',
        enddate: '',
        rating: 5,
        feedback: '',
      },
    };
  },
  methods: {
    getOrders() {
      searchOrder().then((results) => {
        let i;
        for (i = 0; i < results.data.length; i += 1) {
          const thisData = results.data[i];
          thisData.ratingVisible = false;
          thisData.paymentVisible = false;
          this.orders.push(thisData);
        }
      }).catch((err) => {
        this.$notify({
          title: 'Get Orders Info Failed.',
          message: err.response.status,
          duration: 0,
        });
      });
    },
    canMakePayment(order) {
      return order.status === 'Pending Payment' && order.payment === 'credit card';
    },
    canGiveRating(order) {
      return order.edate <= Date.now() && order.status === 'Payment Received';
    },
    placeRating(order) {
      this.param.petname = order.pname;
      this.param.caretakerusername = order.ctaker;
      this.param.startdate = order.sdate;
      this.param.enddate = order.edate;
      if (this.param === 0) {
        this.$notify({
          title: 'Please specify your rating for the service.',
          duration: 0,
        });
      }
      giveRating(this.param).then(() => {
        this.$notify({
          title: 'Your Rating is successfully placed.',
          duration: 0,
        });
      }).catch((err) => {
        this.$notify({
          title: 'Giving rating failed',
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
