<template>
  <div class="signup-wrap" >
  <div class="ms-signup">

      <div class="ms-title">Sign up</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="signup"
        label-width="0px"
        class="ms-content"
      >
        <!-- change icon -->
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username*">
            <el-button slot="prepend" icon="el-icon-user"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="param.email" placeholder="email*">
            <el-button slot="prepend" icon="el-icon-message"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password*"
            v-model="param.password"
            @keyup.enter.native="submitForm()"
            show-password
            minlength = 8
          >
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            type="password"
            placeholder="confirm your password*"
            v-model="param.checkPass"
            minlength = 8
          >
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-row :gutter="18">
          <el-col :span="15">
            <el-form-item prop="otp">
              <el-input
                placeholder="enter OTP*"
                v-model="param.otp"
              >
                <el-button slot="prepend" icon="el-icon-postcard"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <div class = "otp-button">
              <el-button
                :loading="loading"
                type="primary"
                @click="getOTPBtn()"
                :disabled="otpButtonDisabled" >
                Get OTP
              </el-button>
            </div>
          </el-col>
        </el-row>
        <div class="signup-btn">
          <el-button :loading="loading" type="primary" @click="submitForm()">Sign up</el-button>
        </div>
        <p class="signup-tips">Already registerd? <a href='/#/login'>Log in Here</a> </p>
      </el-form>
  </div>
  </div>
</template>

<script>
import { signup, getotp } from '@/api/user';

export default {
  data() {
    const validateEmail = (rule, value, callback) => {
      const regExpEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (regExpEmail.test(value) === false) {
        callback(new Error('Invalid email address format'));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      const regExpPass = /^.{8,20}$/;
      if (regExpPass.test(value) === false) {
        callback(new Error('Password length must be within 8 and 20 inclusive'));
      } else {
        if (this.param.checkPass !== '') {
          this.$refs.signup.validateField('checkPass');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value !== this.param.password && this.param.password !== '') {
        callback(new Error('Confirmed Password does not match with Passowrd'));
      } else {
        callback();
      }
    };
    return {
      param: {
        username: '',
        email: '',
        password: '',
        checkPass: '',
        otp: '',
      },
      rules: {
        username: [
          { required: true, message: 'Please enter a username', trigger: 'blur' },
        ],
        email: [
          { required: true, message: 'Please enter an email', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'Please enter your password', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' },
        ],
        checkPass: [
          { required: true, message: 'Please enter your confirmed password', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' },
        ],
        otp: [
          { required: true, message: 'Please enter the OTP received', trigger: 'blur' },
        ],
      },
      loading: false,
    };
  },
  methods: {
    submitForm() {
      // eslint-disable-next-line consistent-return
      this.$refs.signup.validate((valid) => {
        // console.log('sign up valid?' + valid);
        if (valid) {
          this.loading = true;
          // for testing
          // this.$message.success('User input is valid');

          signup(this.param)
            .then((response) => {
              const { data } = response;
              // eslint-disable-next-line no-console
              console.log(`data: ${data}`);
              this.$store.dispatch('login', this.param)
                .then(() => {
                  // check response is 200
                  // for testing
                  this.$notify({
                    title: 'login successful',
                    message: `Access Token: ${this.$store.getters.token}`,
                    duration: 0,
                  });
                  this.$router.push('/profile');
                  this.loading = false;
                }).catch((error) => {
                  this.loading = false;
                  this.$message.error(error.response.data.error);
                });
            }).catch((error1) => {
              this.$message.error(error1.response.data.error);
              this.loading = false;
            });
        } else {
          // console.log('error in registration');
          this.$message.error('Error in registeration');
          return false;
        }
      });
    },
    getOTPBtn() {
      this.loading = true;
      const email = { email: this.param.email };
      getotp(email)
        .then((response) => {
          this.loading = false;
          const { data } = response;
          this.$notify({
            title: 'getotp successful',
            message: `An OTP has been sent to your email ${this.param.email}`,
            duration: 0,
          });
        }).catch((errorMsg) => {
          const { error } = errorMsg;
          this.$message.error(error);
          this.loading = false;
        });
    },
  },
  computed: {
    otpButtonDisabled() {
      const regExpEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      return regExpEmail.test(this.param.email) === false;
    },
  },
};
</script>

<style>
.signup-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  /* display: flex;
  justify-content: center;
  align-items: center; */
}
.ms-signup {
  position: absolute;
  left: 50%;
  top: 50%;
  margin: 100px 0 0 100px;
  border-radius: 5px;
  width: 350px;
  /* background: rgba(255, 255, 255, 0.3); */
  /* position: absolute;
  justify-content: center;
  align-items: center;
  margin: 100px 0 0 100px;
  width: 350px;
  overflow: hidden; */
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
.signup-btn {
  text-align: center;
}
.signup-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.signup-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
