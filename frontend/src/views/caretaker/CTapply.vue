<template>
  <div class = "main" style = "display:flex; padding:50px">
    <el-container style="height: 100%; width:100%; justify-content:center; ">
        <el-card class="user_apply">
          <div slot="header" class="clearfix">
            <span>Apply to be a Care Taker</span>
          </div>
          <el-form :model="param" :rules="rules" ref="CTapply" class="ms-content">
            <el-form-item prop="realname">
              <span>Confirm your real name</span>
              <el-input v-model="param.realname">
                <!-- <el-button slot="prepend" icon="el-icon-lx-people"></el-button> -->
              </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" v-on:click="apply()" :loading = loading>apply</el-button>
                <el-button type="primary" v-on:click="cancelApply()" plain>
                  cancel
                </el-button>
            </el-form-item>
          </el-form>
        </el-card>
    </el-container>
    </div>
</template>

<script>
import { getUserInfo, updateUserInfo } from '@/api/user';
import { registerCareTaker } from '@/api/caretaker';

export default {
  data() {
    return {
      loading: false,
      param: {
        address: '',
        phone: '',
        prevrealname: '',
        realname: '',
      },
      rules: {
        realname: [{ required: true, message: 'Please specify your real name', trigger: 'blur' }],
      },
    };
  },
  methods: {
    getRealName() {
      getUserInfo().then((response) => {
        const { data } = response;
        this.param.address = data.address;
        this.param.phone = data.phone;
        this.param.prevrealname = data.realname;
        this.param.realname = data.realname;
        // console.log(data);
        // console.log(this.param.realname);
      }).catch((error) => {
        this.$message.error(error.response.data.error);
      });
    },
    apply() {
      this.$refs.CTapply.validate((valid) => {
        if (valid) {
          this.loading = true;
          registerCareTaker(this.param).then(() => {
            // if the real name has been updated
            this.$message.success('success in applying to be a care taker');
            if (this.param.realname.trim() !== this.param.prevrealname.trim()) {
              updateUserInfo(this.param).then(() => {
                this.loading = false;
                // this.$message.success('success in updating real name');
                this.$router.push('/caretaker');
              }).catch((error1) => {
                this.loading = false;
                this.$message.error(error1.response.data.error);
              });
            } else {
              this.loading = false;
              this.$router.push('/caretaker');
            }
          }).catch((error) => {
            this.loading = false;
            this.$message.error(error.response.data.error);
          });
        } else {
          // console.log('error in registration');
          this.$message.error('Error in validating input');
          return false;
        }
      });
    },
    cancelApply() {
      this.$router.push('/profile');
    },
  },
  beforeMount() {
    this.getRealName();
  },
};

</script>

<style>

</style>
