<template>
  <div>
    <el-form :model="param" :rules="rules" class="ms-content">
      <el-row>
        <el-col>
          <el-form-item prop="cardnumber">
            <span>Card Number</span>
            <el-input v-model="param.cardnumber">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item prop="holdername">
            <span>Holder Name</span>
            <el-input v-model="param.holdername">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item prop="expdate">
            <span>Expiry Date</span>
            <el-input v-model="param.exp">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item prop="cvv">
            <span>CVV</span>
            <el-input v-model="param.cvv">
              <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item>
            <div class="bar-btn">
              <el-button type="primary" v-on:click="addCard()">Add Card</el-button>
            </div>
            <div class="bar-btn">
              <el-button type="primary" v-on:click="cancelAdding()" plain>cancel</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { addCard } from '@/api/user';

export default {
  data() {
    return {
      param: {
        cardnumber: '',
        holdername: '',
        cvv: '',
        exp: '',
      },
      rules: {
        cardnumber: [{ required: true, message: 'Please specify your card number', trigger: 'blur' }],
        holdername: [{ required: true, message: 'Please specify the name on your card', trigger: 'blur' }],
        cvv: [{ required: true, message: 'Please specify your cvv', trigger: 'blur' }],
        exp: [{ required: true, message: 'Please specify your expiry date', trigger: 'blur' }],
      },
    };
  },
  methods: {
    addCard() {
      addCard(this.param).then(() => {
        this.$notify({
          title: 'Your card is successfully added',
          message: '',
          duration: 0,
        });
      }).then(() => {
        this.$router.push('/profile');
      }).catch((err) => {
        if (err.response.status === 500) {
          this.$notify({
            title: 'This card cannot be added',
            message: 'Please do not add duplicate cards with same card number. Please ensure your CVV is in correct form.',
            duration: 0,
          });
        }
        if (err.response.status === 400) {
          this.$notify({
            title: 'This card cannot be added',
            message: 'Please ensure your card number contains only numbers, CVV and expiry dates are in correct forms.',
            duration: 0,
          });
        }
      });
    },
    cancelAdding() {
      this.$router.push('/profile');
    },
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
