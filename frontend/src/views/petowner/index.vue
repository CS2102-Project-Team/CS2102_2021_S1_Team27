<template>
  <div>
    <leftbar/>
    <el-form :model="param" :rules="rules" class="ms-content">
      <el-row>
        <el-col>
          <span>Start Date</span>
          <el-form-item prop="startdate">
            <el-input v-model="param.startdate" placeholder="start date" >
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <span>End Date</span>
          <el-form-item prop="enddate">
            <el-input v-model="param.enddate" placeholder="end date">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <span>Pet Category</span>
          <el-form-item prop="petcategory">
            <el-input v-model="param.petcategory" placeholder="pet category">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item>
            <div class="bar-btn">
              <el-button type="primary" v-on:click="getSlot()">search</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-card v-for="(vacancy,index) in vacancies" v-bind:key="index">
        <span style='color:red'>{{ vacancy.realname }}</span>
        <br/>
        <span>{{ vacancy.address }}</span>
        <br/>
        <span>{{ vacancy.rating }}</span>
        <br/>
        <span>{{ vacancy.totalprice }}</span>
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
      vacancies: [],
      param: {
        startdate: '2020-10-09',
        enddate: '2020-10-22',
        petcategory: 'cat',
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
        this.vacancies = results.data;
      }).catch((err) => {
        this.$notify({
          title: 'Search Vacancy fails.',
          message: err.errors,
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
