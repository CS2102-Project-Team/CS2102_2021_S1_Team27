<template>
  <div>
    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <leftbar/>
      </el-aside>
      <el-main>
        <el-card class='box-card' v-for="(pet,index) in pets" v-bind:key="index">
          <div class='text item'>{{ 'Name: ' + pet.pname }}</div>
          <br/>
          <div class='text item'>{{ 'Pet Category: ' + pet.ptype }}</div>
          <br/>
          <div class='text item'>{{ 'Remark: ' + pet.remark }}</div>
          <br/>
          <el-button type="primary" plain v-on:click="pet.dialogVisible=true; param.name=pet.pname">
            Edit Remark
          </el-button>
          <el-dialog title="Update Remark" :visible.sync="pet.dialogVisible" width="50%">
            <div class='text item'>{{ 'Name: ' + pet.pname }}</div>
            <br/>
            <div class='text item'>{{ 'Pet Category: ' + pet.ptype }}</div>
            <br/>
            <div class='text item'>{{ 'New Category: '}}</div>
            <br/>
            <el-select v-model="param.type" placeholder="--pet-category--">
              <el-option v-for="(category,index) in categories" v-bind:key=index :value=category>
              </el-option>
            </el-select>
            <br/>
            <div class='text item'>{{ 'New Remark: '}}</div>
            <el-input v-model="param.remark">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
            <br/>
            <span>
              <el-button v-on:click="pet.dialogVisible=false">Cancel</el-button>
              <el-button type="primary" v-on:click="updateRemark()">Update</el-button>
            </span>
          </el-dialog>
        </el-card>
        <el-button type="primary" v-on:click="goToAddPet()">Add Pet</el-button>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { searchPets, updatePet } from '@/api/petowner';
import leftbar from './components/leftbar.vue';

export default {
  data() {
    return {
      pets: [],
      categories: ['dog', 'cat', 'fish'],
      param: {
        name: '',
        type: '',
        remark: '',
      },
    };
  },
  methods: {
    getPets() {
      searchPets().then((results) => {
        let i;
        for (i = 0; i < results.data.length; i += 1) {
          const thisPet = results.data[i];
          thisPet.dialogVisible = false;
          this.pets.push(thisPet);
        }
        this.pets = results.data;
      }).catch((err) => {
        this.$notify({
          title: 'Get Pets Info Failed.',
          message: err.responses.status,
          duration: 0,
        });
      });
    },
    goToAddPet() {
      this.$router.push('/po/pets/add_pet');
    },
    updateRemark() {
      if (this.param.type === '') {
        this.$notify({
          title: 'Please specify your new pet category.',
          duration: 0,
        });
        return;
      }
      updatePet(this.param).then(() => {
        this.$notify({
          title: 'Update Pets Remark Successfully.',
          duration: 0,
        });
      }).then(() => {
        this.getPets();
      }).catch((err) => {
        this.$notify({
          title: 'Cannot update the pet remark',
          message: err.responses.status,
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
