<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ username }}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="goToEdit()">
          Edit Profile
        </el-button>
      </div>
      <div class="text item">
        {{ 'Email: ' + email }}
      </div>
      <div class="text item">
        {{ 'Address: ' + address }}
      </div>
      <div class="text item">
        {{ 'Phone: ' + phone }}
      </div>
      <div class="text item">
        {{ 'Real Name: ' + realname }}
      </div>
    </el-card>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user';

export default {
  data() {
    return {
      loggedin: !!this.$store.getters.token,
      username: '',
      email: '',
      address: '',
      phone: '',
      realname: '',
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
        .then(() => {
          this.$message.success('Sign out successful!');
          this.$router.push('/');
        }).catch((error) => {
          this.$message.error(error);
        });
    },

    getUserInfo() {
      getUserInfo().then((results) => {
        if (results.status === 200) {
          this.username = results.data.username;
          this.email = results.data.email;
          this.address = results.data.address;
          this.phone = results.data.phone;
          this.realname = results.data.realname;
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
          message: err.error,
          duration: 0,
        });
      });
    },

    goToEdit() {
      this.$router.push('/profile/edit');
    },
  },
  beforeMount() {
    this.getUserInfo();
  },
};
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>
