<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">Pet-Anything</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username/email">
            <el-button slot="prepend" icon="el-icon-user"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="param.password"
            @keyup.enter.native="submitForm()"
          >
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-signup-btn">
          <el-button :loading="loading" type="primary" @click="submitForm()">Sign in</el-button>
        </div>
        <div class="login-signup-btn">
          <el-button :loading="loading" type="primary" plain @click="goToRegister()">
            Register
          </el-button>
        </div>
        <!-- <p class="login-tips">Tips : Register not implemented yet :></p> -->
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      param: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: 'Please enter a username', trigger: 'blur' },
        ],
        password: [{ required: true, message: 'Please enter your password', trigger: 'blur' }],
      },
      loading: false,
    };
  },
  methods: {
    submitForm() {
      // eslint-disable-next-line consistent-return
      this.$refs.login.validate((valid) => {
        if (valid) {
          this.loading = true;
          // this.$message.success('User input is valid');
          this.$store.dispatch('login', this.param)
            .then(() => {
              this.$notify({
                title: 'Login successful',
                message: `Access Token: ${this.$store.getters.token}`,
                duration: 0,
              });
              this.$router.push('/profile');
              this.loading = false;
            }).catch((error) => {
              // eslint-disable-next-line no-nested-ternary
              this.$message.error(error.response ? (error.response.data ? error.response.data.error : 'err') : 'err');
              this.loading = false;
            });
        } else {
          this.$message.error('Please enter your username and password');
          return false;
        }
      });
    },
    goToRegister() {
      // navigate to the registration page
      this.$store.dispatch('signup')
        .then(() => {
          this.$router.push('/signup');
        }).catch((error) => {
          this.$message.error(error);
        });
    },
  },
};
</script>

<style>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/lisu_bg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
}
.ms-login {
  position: absolute;
  left: 5%;
  top: 8%;
  width: 350px;
  margin: 100px 0 0 100px;
  border-radius: 5px;
  background: rgba(40, 55, 71, 0.6);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: rgb(255, 255, 255);
  border-bottom: 1px solid #ddd;
}
.login-signup-btn {
  text-align: center;
}
.login-signup-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
/* .login-tips {
  font-size: 12px;
  line-height: 30px;
  color: rgb(17, 255, 96);
} */
</style>
