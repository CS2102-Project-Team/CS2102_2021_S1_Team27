<template>
  <div>
    <leftbar/>
    <el-card v-for="(pet,index) in pets" v-bind:key="index">
      <span style='color:red'>{{ pet.pname }}</span>
      <br/>
      <span>{{ pet.ptype }}</span>
      <br/>
      <span>{{ pet.remark }}</span>
      <br/>
    </el-card>
    <el-button type="primary" v-on:click="goToAddPet()">Add Pet</el-button>
  </div>
</template>

<script>
import { searchPets } from '@/api/petowner';
import leftbar from './components/leftbar.vue';

export default {
  data() {
    return {
      pets: [],
    };
  },
  methods: {
    getPets() {
      searchPets().then((results) => {
        this.pets = results.data;
      }).catch((err) => {
        this.$notify({
          title: 'Get Pets Info Failed.',
          message: err.errors,
          duration: 0,
        });
      });
    },
    goToAddPet() {
      this.$notify({
        title: 'To be implemented.',
        message: 'To be implemented',
        duration: 0,
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

<style scoped>

</style>
