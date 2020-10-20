<template>
  <div>
    <el-form :model="param" :rules="rules" class="ms-content">
      <el-row>
        <el-col>
          <el-form-item prop="address">
            <span>Updated Address</span>
            <el-input v-model="param.address">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item prop="phone">
            <span>Updated Phone Number</span>
            <el-input v-model="param.phone">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item prop="realname">
            <span>Updated Real Name</span>
            <el-input v-model="param.realname">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item>
            <div class="bar-btn">
              <el-button type="primary" v-on:click="updateProfile()">update</el-button>
            </div>
            <div class="bar-btn">
              <el-button type="primary" v-on:click="cancelUpdate()" plain>cancel</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getUserInfo, updateUserInfo } from '@/api/user';

export default {
  data() {
    return {
      username: '',
      email: '',
      param: {
        address: '',
        phone: '',
        realname: '',
      },
      rules: {
        address: [{ required: true, message: 'Please specify your address', trigger: 'blur' }],
        phone: [{ required: true, message: 'Please specify your phone', trigger: 'blur' }],
        realname: [{ required: true, message: 'Please specify your real name', trigger: 'blur' }],
      },
    };
  },
  methods: {
    updateProfile() {
      updateUserInfo(this.param).then((results) => {
        if (results.status === 204) {
          this.$notify({
            title: 'Update successful',
            message: 'Your profile is updated successfully',
            duration: 0,
          });
          this.$router.push('/profile');
        } else {
          this.$notify({
            title: 'Update failed',
            message: `Your profile cannot be updated, error code ${results.status}`,
            duration: 0,
          });
          this.$router.push('/profile');
        }
      });
    },
    cancelUpdate() {
      this.$router.push('/profile');
    },
    getUserInfo() {
      getUserInfo().then((results) => {
        if (results.status === 200) {
          this.username = results.data.username;
          this.email = results.data.email;
          this.param.address = results.data.address;
          this.param.phone = results.data.phone;
          this.param.realname = results.data.realname;
        } else {
          this.$notify({
            title: 'Fetch User Info Failed.',
            message: `Your profile cannot be updated, error code ${results.status}`,
            duration: 0,
          });
        }
      }).catch((err) => {
        this.$notify({
          title: 'Fetch User Info Failed.',
          message: err.errors,
          duration: 0,
        });
      });
    },
  },
  beforeMount() {
    this.getUserInfo();
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
