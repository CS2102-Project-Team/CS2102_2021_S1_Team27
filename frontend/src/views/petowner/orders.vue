<template>
  <div>
    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <leftbar/>
      </el-aside>
      <el-main>

        <el-table :data="orders" border style="width: 100%" max-height="500">
          <el-table-column fixed prop="pname" label="Pet Name" Width="100"></el-table-column>
          <el-table-column prop="ctaker" label="Caretaker Username" Width="150"></el-table-column>
          <el-table-column prop="sdate" label="Start Date" Width="150"></el-table-column>
          <el-table-column prop="edate" label="End Date" Width="150"></el-table-column>
          <el-table-column prop="delivery" label="Delivery Mode" Width="150"></el-table-column>
          <el-table-column prop="status" label="Status" Width="200"></el-table-column>
          <el-table-column prop="rating" label="Rating" Width="150"></el-table-column>
          <el-table-column prop="review" label="Feedback" Width="150"></el-table-column>
          <el-table-column fixed="right" label="Actions" Width="150">
            <template slot-scope="scope">
              <el-button v-if="canMakePayment(scope.row)" type="text" size="small"
                         @click="orders[scope.$index].paymentVisible=true">
                Pay
              </el-button>
              <el-button v-if="canGiveRating(scope.row)" type="text" size="small"
                         @click="orders[scope.$index].ratingVisible=true">
                Feedback
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div v-for="(order,index) in orders" v-bind:key="index">
          <el-dialog title='Give Rating' :visible.sync="order.ratingVisible" width="50%">
            <el-row :gutter="20" align="middle">
              <el-col :span="3">
                <div class='text'>Rating</div>
              </el-col>
              <el-col :span="2">
                <el-select v-model.number="param.rating" placeholder="--select-rating--">
                  <el-option v-for="(mark,index) in [1,2,3,4,5]" :key="index"
                             :label="mark" :value="mark">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row :gutter="20" align="middle">
              <el-col :span="3">
                <div class='text'>Feedback</div>
              </el-col>
              <el-col :span="17">
                <el-input v-model="param.feedback">
                  <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                </el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20" align="middle">
              <el-col :span="3">
                <el-button type="primary" v-on:click="placeRating(order)">Confirm</el-button>
              </el-col>
              <el-col :span="3">
                <el-button v-on:click="order.ratingVisible=false">Cancel</el-button>
              </el-col>
            </el-row>
          </el-dialog>

          <el-dialog title='Make payment' :visible.sync="order.paymentVisible" width="50%">
            <el-row :gutter="20" align="middle">
              <el-col :span="5">
                <div class='text'>Select Card</div>
              </el-col>
              <el-col :span="10">
                <el-select v-model="selectedCard" placeholder="--select-card--">
                  <el-option v-for="(card, index) in myCards" :key="index"
                             :label="card.cardnumber" :value="card.cardnumber">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row :gutter="20" align="middle">
              <el-col :span="3">
                <el-button type="primary" v-on:click="makePayment(order)">Confirm</el-button>
              </el-col>
              <el-col :span="3">
                <el-button v-on:click="order.paymentVisible=false">Cancel</el-button>
              </el-col>
            </el-row>
          </el-dialog>
        </div>

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
      if (this.selectedCard === '') {
        this.$notify({
          title: 'Specify a card for payment',
          message: 'Please choose a credit card in order to make payment.',
          duration: 0,
        });
        return;
      }
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
