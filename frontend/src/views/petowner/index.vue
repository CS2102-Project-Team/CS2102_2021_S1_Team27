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
              placeholder="--select-date--">
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
              placeholder="--end-date--">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="2">
          Pet Category
        </el-col>
        <el-col :span="4">
          <el-form-item prop="petcategory">
            <el-select v-model="param.petcategory" placeholder="--pet-category--">
              <el-option v-for="(category,index) in categories" v-bind:key=index :value=category>
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
        <div class='text item'>{{ 'Care Taker Name: ' + vacancy.realname }}</div>
        <br/>
        <div class='text item'>{{ 'Address: ' + vacancy.address }}</div>
        <br/>
        <div class='text item'>{{ 'Rating: ' + vacancy.rating }}</div>
        <br/>
        <div class='text item'>{{ 'Total Price: ' + vacancy.totalprice }}</div>
        <br/>
        <el-button type="primary" v-on:click="orderDetail(vacancy)">place order</el-button>
      </el-card>
    </div>
  </div>
</template>

<script>
import { searchVacancy } from '@/api/petowner';
import leftbar from './components/leftbar.vue';

export default {
  data() {
    return {
      categories: ['cat', 'dog', 'fish'],
      vacancies: [],
      param: {
        startdate: '',
        enddate: '',
        petcategory: '',
      },
      rules: {
        startdate: [{ required: true, message: 'Please specify your start date', trigger: 'blur' }],
        enddate: [{ required: true, message: 'Please specify your end date', trigger: 'blur' }],
        petcategory: [{ required: true, message: 'Please specify your pet category', trigger: 'blur' }],
      },
      loading: false,
    };
  },
  methods: {
    getSlot() {
      searchVacancy(this.param).then((results) => {
        let i;
        for (i = 0; i < results.data.length; i += 1) {
          const thisData = results.data[i];
          if (thisData.rating === '-1') {
            thisData.rating = 'No rating has been given to this caretaker yet';
          }
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
    orderDetail(vacancy) {
      console.log(`Entering an vacancy detail of ${vacancy.realname}.`);
      alert(`Entering an vacancy detail of ${vacancy.realname}.`);
    },
  },
  components: {
    leftbar,
  },
};
</script>

<style>
.text {
  font-size: 20px;
}
.item {
  margin-bottom: 12px;
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
