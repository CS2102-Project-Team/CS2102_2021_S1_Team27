<template>
  <div>
    <el-container>

      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <leftbar/>
      </el-aside>

      <el-main>

        <el-form :model="param" :rules="rules" class="ms-content">
          <el-row type="flex" align="middle" justify="center">
            <el-col :span="2">
              From
            </el-col>
            <el-col :span="5">
              <div>
                <el-date-picker v-model="param.startdate" type="date" placeholder="--select-date--"
                                value-format="yyyy-MM-dd" :picker-options="startOptions">
                </el-date-picker>
              </div>
            </el-col>
            <el-col :span="2">
              To
            </el-col>
            <el-col :span="5">
              <div>
                <el-date-picker v-model="param.enddate" type="date" placeholder="--end-date--"
                                value-format="yyyy-MM-dd" :picker-options="endOptions">
                </el-date-picker>
              </div>
            </el-col>
            <el-col :span="2">
              Pet Category
            </el-col>
            <el-col :span="5">
              <div>
                <el-select v-model="param.petcategory" placeholder="--select-pet-type--">
                  <el-option v-for="(category,index) in categories" :key="index"
                             :label="category" :value="category">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="bar-btn">
                <el-button type="primary" v-on:click="getSlot()">search</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>

        <div>
          <el-table :data="vacancies" border max-height="500">
            <el-table-column prop="realname" label="Caretaker Name" width="150">
            </el-table-column>
            <el-table-column prop="realname" label="Caretaker Type" width="150">
            </el-table-column>
            <el-table-column prop="addres" label="Address" width="200">
            </el-table-column>
            <el-table-column prop="rating" label="Rating" width="150">
            </el-table-column>
            <el-table-column prop="totalprice" label="Total Price" width="100">
            </el-table-column>
            <el-table-column label="Caretaker Details" width="200">
              <template slot-scope="scope">
                <el-button @click="scope.row.reviewVisible=true; getCTReview(scope.row.username)"
                           type="text" size="small">
                Get Caretaker Past Reviews
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="Place Order" width="150">
              <template slot-scope="scope">
                <el-button @click="scope.row.dialogVisible=true" type="primary" size="small">
                  Place Order
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div v-for="(vacancy,index) in vacancies" v-bind:key="index">

            <el-dialog title='All Reviews of this care taker' 
                       :visible.sync="vacancy.reviewVisible" width="50%">
                <el-row type="flex" justify="center" align="middle">
                    <div class='text'>{{ 'Care Taker Name: ' + vacancy.realname }}</div>
                </el-row>
                <el-row type="flex" justify="center" align="middle">
                    <el-table :data="pastorders" border max-height="250" style="width: 50%">
                        <el-table-column prop="petcategory" label="Pet Category" width="100">
                        </el-table-column>
                        <el-table-column prop="rating" label="Rating" width="100">
                        </el-table-column>
                        <el-table-column prop="review" label="Review" width="200">
                        </el-table-column>
                    </el-table>
                </el-row>
            </el-dialog>

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

          </div>
        </div>

      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  searchVacancy, placeOrder, searchPets, getCTReview,
} from '@/api/petowner';
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
            return time.getTime() > new Date(this.param.enddate).getTime() || a;
          }
          return a;
        },
      },
      endOptions: {
        disabledDate: (time) => {
          const a = time.getTime() < Date.now();
          if (this.param.startdate !== '') {
            return time.getTime() < new Date(this.param.startdate).getTime() - 8.64e7 || a;
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
            thisData.rating = 'No rating given yet';
          } else {
            thisData.rating = Number.parseFloat(thisData.rating).toFixed(2);
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
