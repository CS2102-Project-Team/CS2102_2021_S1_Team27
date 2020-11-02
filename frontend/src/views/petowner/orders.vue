<template>
  <div>
    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <leftbar/>
      </el-aside>
      <el-main>
        <el-card class='box-card' v-for="(order,index) in orders" v-bind:key="index">
          <div class='text'>{{ 'Pet Name: ' + order.pname }}</div>
          <div class='text'>{{ 'Caretaker Username: ' + order.ctaker }}</div>
          <div class='text'>{{ 'Start Date: ' + order.sdate }}</div>
          <div class='text'>{{ 'End Date: ' + order.edate }}</div>
          <div class='text'>{{ 'Delivery Mode: ' + order.delivery }}</div>
          <div class='text'>{{ 'Status: ' + order.status }}</div>
          <div class='text'>{{ 'Rating: ' + order.rating }}</div>
          <div class='text'>{{ 'Feedback: ' + order.review }}</div>
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
            <el-select v-model.number="param.rating" placeholder="--select-rating--">
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
            <el-select v-model="selectedCard" placeholder="--select-card--">
              <el-option v-for="(card, index) in myCards" :key="index"
              :label="card.cardnumber" :value="card.cardnumber">
              </el-option>
            </el-select>
            <br/>
            <span>
              <el-button type="primary" v-on:click="makePayment(order)">Confirm</el-button>
              <el-button v-on:click="order.paymentVisible=false">Cancel</el-button>
            </span>
          </el-dialog>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { searchOrder, giveRating, makePayment } from '@/api/petowner';
import { getCards } from '@/api/user';
import leftbar from './components/leftbar.vue';

export default {
  data() {
    return {
      orders: [],
      myCards: [],
      selectedCard: '',
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
      this.orders = [];
      searchOrder().then((results) => {
        let i;
        for (i = 0; i < results.data.length; i += 1) {
          const thisData = results.data[i];
          thisData.ratingVisible = false;
          thisData.paymentVisible = false;
          if (!thisData.rating) {
            thisData.rating = 'Not Given';
          }
          if (!thisData.review) {
            thisData.review = 'Not Given';
          }
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
    getAllCards() {
      this.myCards = [];
      getCards().then((results) => {
        this.myCards = results.data;
      }).catch((err) => {
        this.$notify({
          title: 'Get Credit Cards Info Failed.',
          message: err.response.status,
          duration: 0,
        });
      });
    },
    canMakePayment(order) {
      return order.status === 'Pending Payment' && order.payment === 'credit card';
    },
    canGiveRating(order) {
      return new Date(order.edate).getTime() <= Date.now() && (order.status === 'Pending Payment' || order.status === 'Payment Received');
    },
    makePayment(order) {
      const petname = order.pname;
      const caretakerusername = order.ctaker;
      const startdate = order.sdate;
      const enddate = order.edate;
      const data = {
        petname, caretakerusername, startdate, enddate,
      };
      makePayment(data).then(() => {
        this.$notify({
          title: 'Payment is successfully made.',
          duration: 0,
        });
      }).then(() => {
        this.paymentVisible = false;
        this.getOrders();
      }).catch((err) => {
        this.$notify({
          title: 'Payment failed',
          message: err.response.status,
          duration: 0,
        });
      });
    },
    placeRating(order) {
      this.param.petname = order.pname;
      this.param.caretakerusername = order.ctaker;
      this.param.startdate = order.sdate;
      this.param.enddate = order.edate;
      giveRating(this.param).then(() => {
        this.$notify({
          title: 'Your Rating is successfully placed.',
          duration: 0,
        });
      }).then(() => {
        this.getOrders();
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
    this.getAllCards();
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
