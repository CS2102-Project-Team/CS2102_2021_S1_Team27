<template>
  <div>
    <!-- <el-card class="box-card">
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
    <el-button type="primary" @click="logout()">Sign out</el-button>
    <el-button v-on:click="goToPO()">Pet Owner Page</el-button>
    <el-button v-on:click="goToCT()">Care Taker Page</el-button> -->
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
    isLoggedin() {
      if (this.$store.getters.token) {
        // console.log('ser has logged in');
        this.$router.push('/profile');
      }
    },
    // logout() {
    //   this.$store.dispatch('logout')
    //     .then(() => {
    //       this.$message.success('Sign out successful!');
    //       this.$router.push('/');
    //     }).catch((error) => {
    //       this.$message.error(error);
    //     });
    // },

    // getUserInfo() {
    //   getUserInfo().then((results) => {
    //     if (results.status === 200) {
    //       console.log(results.data);
    //       this.username = results.data.username;
    //       this.email = results.data.email;
    //       this.address = results.data.address;
    //       this.phone = results.data.phone;
    //       this.realname = results.data.realname;
    //     } else {
    //       console.log(results.status, results.error);
    //     }
    //   });
    // },

    // goToPO() {
    //   console.log('Entering the petowner page.');
    //   this.$router.push('/po');
    // },

    // goToCT() {
    //   console.log('Entering the caretaker page.');
    // },

    // goToEdit() {
    //   console.log('Entering Profile edition page.');
    //   this.$router.push('/home/update_profile');
    // },
  },
  beforeMount() {
    this.isLoggedin();
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
