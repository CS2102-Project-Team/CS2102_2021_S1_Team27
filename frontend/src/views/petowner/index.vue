<template>
  <div>
    <leftbar/>
    <el-form :model="param" :rules="rules" class="ms-content">
      <el-row :gutter="25">
        <el-col :span="2">
          From
        </el-col>
        <el-col :span="4">
          <div>
            <el-date-picker
              v-model="param.startdate"
              type="date"
              placeholder="--select-date--"
              :picker-options="startOptions">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="1">
          To
        </el-col>
        <el-col :span="4">
          <div>
            <el-date-picker
              v-model="param.enddate"
              type="date"
              placeholder="--end-date--"
              :picker-options="endOptions">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="2">
          Pet Category
        </el-col>
        <el-col :span="4">
          <el-form-item prop="petcategory">
            <el-select v-model="param.petcategory" placeholder="--select-pet-type--">
              <el-option v-for="(category,index) in categories" :key="index"
              :label="category" :value="category">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <div class="bar-btn">
              <el-button type="primary" v-on:click="getSlot()">search</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-card class='box-card' v-for="(vacancy,index) in vacancies" v-bind:key="index">
        <div v-on:click="vacancy.reviewVisible=true; getCTReview(vacancy.username)"
        class='text item'>
          {{ 'Care Taker Name: ' + vacancy.realname }}
        </div>
        <el-dialog title='All Reviews of this care taker' :visible.sync="vacancy.dialogVisible">
          <el-form label-width="80px">
            <el-form-item>
              <div class='text'>
                {{ 'Care Taker Name: ' + vacancy.realname }}
              </div>
              <el-card class='box-card' v-for="(pastorder,index) in pastorders" v-bind:key="index">
                <div class='text'>{{ "Pet Category: " + pastorder.petcategory }}</div>
                <div class='text'>{{ "Rating: " + pastorder.rating }}</div>
                <div class='text'>{{ "Review: " + pastorder.review }}</div>
              </el-card>
            </el-form-item>
          </el-form>
        </el-dialog>
        <br/>
        <div class='text item' v-if="vacancy.fulltime">{{ 'Full Time' }}</div>
        <div class='text item' v-else>{{ 'Part Time' }}</div>
        <br/>
        <div class='text item'>{{ 'Address: ' + vacancy.addres }}</div>
        <br/>
        <div class='text item'>{{ 'Rating: ' + vacancy.rating }}</div>
        <br/>
        <div class='text item'>{{ 'Total Price: ' + vacancy.totalprice }}</div>
        <br/>
        <el-button type="primary" v-on:click="vacancy.dialogVisible=true">place order</el-button>
        <el-dialog title='Place Order' :visible.sync="vacancy.dialogVisible" width="50%">
          <el-form label-width="80px">
            <el-form-item>
              <div class='text'>
                {{ 'Care Taker Name: ' + vacancy.realname }}
              </div>
            </el-form-item>
            <el-form-item>
              <div class='text' v-if="vacancy.fulltime">{{ 'Full Time' }}</div>
              <div class='text' v-else>{{ 'Part Time' }}</div>
            </el-form-item>
            <el-form-item>
              <div class='text'>{{ 'Address: ' + vacancy.addres }}</div>
            </el-form-item>
            <el-form-item>
              <div class='text'>{{ 'Rating: ' + vacancy.rating }}</div>
            </el-form-item>
            <el-form-item>
              <div class='text'>{{ 'Total Price: ' + vacancy.totalprice }}</div>
            </el-form-item>
            <el-form-item>
              <div class='text'>{{ 'Pet Category: ' + param.petcategory }}</div>
            </el-form-item>
            <el-form-item>
              <el-row :gutter="50">
                <el-col :span="25">
                  Select Pet
                </el-col>
                <el-col :span="25">
                  <el-select v-model="pname" placeholder="--select-pet--">
                    <div v-for="(pet,index) in allMyPets" :key="index">
                      <el-option  v-if="pet.ptype===param.petcategory"
                      :label="pet.pname" :value="pet.pname">
                      </el-option>
                    </div>
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="50">
                <el-col :span="25">
                  Select Payment Method
                </el-col>
                <el-col :span="25">
                  <el-select v-model="paymentmethod" placeholder="--select-payment-method--">
                    <el-option v-for="(category,index) in allPayMethods" :key="index"
                    :label="category" :value="category">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="50">
                <el-col :span="25">
                  Select Delivery Method
                </el-col>
                <el-col :span="25">
                  <el-select v-model="deliverymode" placeholder="--select-delivery-mode--">
                    <el-option v-for="(category,index) in allDeliveryMethod" :key="index"
                    :label="category" :value="category">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
            <span>
              <el-button v-on:click="vacancy.dialogVisible=false">Cancel</el-button>
              <el-button type="primary" v-on:click="placeOrder(vacancy)">Confirm</el-button>
            </span>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
import { searchVacancy, placeOrder, searchPets, getCTReview } from '@/api/petowner';
import leftbar from './components/leftbar.vue';

export default {
  data() {
    return {
      categories: ['cat', 'dog', 'fish'],
      allPayMethods: ['credit card', 'cash'],
      allDeliveryMethod: ['pet owner deliver', 'care taker pick up', 'transfer through pcs'],
      allMyPets: [],
      pname: '',
      paymentmethod: '',
      deliverymode: '',
      vacancies: [],
      pastorders: [],
      param: {
        startdate: '',
        enddate: '',
        petcategory: '',
      },
      rules: {
        startdate: [{ required: true, message: 'Please specify your start date', trigger: 'blur' }],
        enddate: [{ required: true, message: 'Please specify your end date', trigger: 'blur' }],
        petcategory: [{ required: true, message: 'Please specify one of your pets', trigger: 'blur' }],
      },
      loading: false,
      startOptions: {
        disabledDate: (time) => {
          const a = time.getTime() < Date.now();
          if (this.param.enddate !== '') {
            return time.getTime() >= new Date(this.param.enddate).getTime() || a;
          }
          return a;
        },
      },
      endOptions: {
        disabledDate: (time) => {
          const a = time.getTime() < Date.now();
          if (this.param.startdate !== '') {
            return time.getTime() <= new Date(this.param.startdate).getTime() || a;
          }
          return a;
        },
      },
    };
  },
  methods: {
    getSlot() {
      this.vacancies = [];
      if (this.param.startdate === '' || this.param.enddate === '' || this.param.petcategory === '') {
        this.$notify({
          title: 'Please fill in the start date, end date and the pet category.',
          duration: 0,
        });
        return;
      }
      searchVacancy(this.param).then((results) => {
        let i;
        for (i = 0; i < results.data.length; i += 1) {
          const thisData = results.data[i];
          if (thisData.rating === '-1') {
            thisData.rating = 'No rating has been given to this caretaker yet';
          }
          thisData.dialogVisible = false;
          thisData.reviewVisible = false;
          this.vacancies.push(thisData);
        }
        // this.vacancies = results.data;
      }).catch((err) => {
        this.$notify({
          title: 'Search Vacancy fails.',
          message: err.response.error,
          duration: 0,
        });
      });
    },
    getCTReview(caretakerusername) {
      getCTReview(caretakerusername).then((results) => {
        this.pastorders = results.data;
      }).catch((err) => {
        this.$notify({
          title: 'Get all rating informations failed.',
          message: err.response.errors,
          duration: 0,
        });
      });
    },
    getPets() {
      searchPets().then((results) => {
        this.allMyPets = results.data;
      }).catch((err) => {
        this.$notify({
          title: 'Get Pets Info Failed.',
          message: err.response.errors,
          duration: 0,
        });
      });
    },
    placeOrder(vacancy) {
      const caretakername = vacancy.username;
      const petname = this.pname;
      const { startdate, enddate } = this.param;
      const { paymentmethod, deliverymode } = this;
      if (petname === '' || paymentmethod === '' || deliverymode === '') {
        this.$notify({
          title: 'Please specify your pet, payment method and delivery mode.',
          duration: 0,
        });
        return;
      }
      const data = {
        caretakername, petname, startdate, enddate, paymentmethod, deliverymode,
      };
      placeOrder(data).then(() => {
        this.$notify({
          title: 'Place Order',
          message: 'Your order has been placed.',
          duration: 0,
        });
      }).then(() => {
        this.$router.push('/po/orders');
      }).catch((err) => {
        this.$notify({
          title: 'Order cannot be placed',
          message: err.response.error,
          duration: 0,
        });
      });
    },
  },
  components: {
    leftbar,
  },
  beforeMount() {
    this.getPets();
  },
};
</script>

<style>
.text {
  font-size: 20px;
}
.item {
  margin-bottom: 6px;
}
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
.box-card {
  width: 480px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 300px;
  min-height: 400px;
}
</style>
