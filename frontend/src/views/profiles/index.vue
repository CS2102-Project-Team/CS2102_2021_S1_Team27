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
    <div>My Credit Cards</div>
    <el-card v-for="(card,index) in cards" v-bind:key="index">
      <span>{{ 'Card Number: ' + card.cardnumber }}</span>
      <el-button type="primary" v-on:click="deleteCard(card.cardnumber)">Delete Card</el-button>
    </el-card>
    <el-button type="primary" v-on:click="goToAddCard()">Add Card</el-button>
  </div>
</template>

<script>
import { getUserInfo, getCards, deleteCard } from '@/api/user';

export default {
  data() {
    return {
      loggedin: !!this.$store.getters.token,
      username: '',
      email: '',
      address: '',
      phone: '',
      realname: '',
      cards: [],
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

    goToAddCard() {
      this.$router.push('/profile/add_card');
    },

    deleteCard(cardnumber) {
      deleteCard(cardnumber).then((results) => {
        if (results.status === 204) {
          this.$notify({
            title: 'Credit card deleted successfully',
            message: `Card ${cardnumber} is deleted.`,
            duration: 0,
          });
        }
      }).catch((err) => {
        this.$notify({
          title: 'Credit card cannot be deleted',
          message: err.reponse.status,
          duration: 0,
        });
      }).then(() => {
        this.getCards();
      });
    },

    getCards() {
      getCards().then((results) => {
        this.cards = results.data;
      }).catch((err) => {
        this.$notify({
          title: 'Fetch Card Info Failed.',
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
    this.getCards();
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
