<template>
  <div>
    <el-container>
    
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <leftbar/>
    </el-aside>

    <el-main>
    <el-form :model="param" :rules="rules" class="ms-content">
      <el-row :gutter="20" type="flex" justify="center" align="middle">
        <el-col :span="5">
          <el-form-item prop="name">
            <span>Pet Name</span>
            <el-input v-model="param.name">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="type">
            <span>Pet Category</span>
            <br/>
            <el-select v-model="param.type" placeholder="--pet-category--" size="medium">
              <el-option v-for="(category,index) in categories" v-bind:key=index :value=category>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" type="flex" justify="center">
        <el-col :span="10">
          <el-form-item prop="remark">
            <span>Remark</span>
            <el-input v-model="param.remark">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" type="flex" justify="center">
        <el-col :span="10">
          <el-form-item>
            <div class="bar-btn">
              <el-button type="primary" v-on:click="addPet()">Add Pet</el-button>
            </div>
            <div class="bar-btn">
              <el-button type="primary" v-on:click="cancelAdding()" plain>cancel</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </el-main>

    </el-container>
  </div>
</template>

<script>
import { addPet } from '@/api/petowner';
import leftbar from './components/leftbar.vue';

export default {
  data() {
    return {
      categories: ['cat', 'dog', 'fish'],
      param: {
        name: '',
        type: '',
        remark: '',
      },
      rules: {
        name: [{ required: true, message: 'Please specify your pet name', trigger: 'blur' }],
        type: [{ required: true, message: 'Please specify your pet category', trigger: 'blur' }],
      },
    };
  },
  methods: {
    addPet() {
      if (this.param.name === '' || this.param.type === '') {
        this.$notify({
          title: 'Please specify your pet name and pet category',
          message: '',
          duration: 0,
        });
        return;
      }
      addPet(this.param).then(() => {
        this.$notify({
          title: 'Your pet is successfully added',
          message: '',
          duration: 0,
        });
      }).then(() => {
        this.$router.push('/po/pets');
      }).catch((err) => {
        if (err.response.status === 500) {
          this.$notify({
            title: 'This pet cannot be added',
            message: 'Please do not add pet with duplicate name.',
            duration: 0,
          });
        }
        if (err.response.status === 400) {
          this.$notify({
            title: 'This pet cannot be added',
            message: 'Please do not add pet with duplicate name.',
            duration: 0,
          });
        }
      });
    },
    cancelAdding() {
      this.$router.push('/po/pets');
    },
  },
  components: {
    leftbar,
  },
};
</script>

<style scoped>
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
