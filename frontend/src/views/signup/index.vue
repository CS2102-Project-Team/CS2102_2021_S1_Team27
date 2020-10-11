<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">Pet-Anything</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="param.email" placeholder="email">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="address">
          <el-input v-model="param.address" placeholder="address">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="param.phone" placeholder="phone">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="password" v-model="param.password">
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="cpassword">
          <el-input type="password" placeholder="confirm password" v-model="param.cpassword">
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-signup-btn">
          <el-button :loading="loading" type="primary">Sign up</el-button>
        </div>
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
        email: '',
        address: '',
        phone: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: 'Please specify your username', trigger: 'blur' },
        ],
        email: [
          { required: true, message: 'Please specify your email', trigger: 'blur' },
        ],
        address: [
          { required: true, message: 'Please specify your address', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: 'Please specify your phone number', trigger: 'blur' },
        ],
        password: [{ required: true, message: 'Please specify your password', trigger: 'blur' }],
        cpassword: [{ required: true, message: 'Please confirm your password', trigger: 'blur' }],
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
          this.$message.success('User input is valid');
          this.$store.dispatch('login', this.param)
            .then(() => {
              this.$notify({
                title: 'Login successful',
                message: `Access Token: ${this.$store.getters.token}`,
                duration: 0,
              });
              this.$router.push('/');
              this.loading = false;
            }).catch((error) => {
              this.$message.error(error);
              this.loading = false;
            });
        } else {
          this.$message.error('Please enter your username and pssword');
          return false;
        }
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
  background-image: url(../../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: 100px 0 0 100px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
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
  color: #fff;
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
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: rgb(17, 255, 96);
}
</style>
