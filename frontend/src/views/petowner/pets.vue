<template>
  <div>
    <leftbar/>
    <el-card class='box-card' v-for="(pet,index) in pets" v-bind:key="index">
      <div class='text item'>{{ 'Name: ' + pet.pname }}</div>
      <br/>
      <div class='text item'>{{ 'Pet Category: ' + pet.ptype }}</div>
      <br/>
      <div class='text item'>{{ 'Remark: ' + pet.remark }}</div>
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
      this.$router.push('/po/pets/add_pet');
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
