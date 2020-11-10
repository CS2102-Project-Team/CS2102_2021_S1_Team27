<template>
  <div class = "home-wrap"> 
    <div class="center fill">
      <div>
      <h1 class = "title2">Welcome to</h1>
      <h1 class="title">Pet-Anything</h1>
      <h2 class = "slogan title2">
          No job is too big, No pup is too small
      </h2>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    isLoggedin() {
      if (this.$store.getters.token) {
        // console.log('ser has logged in');
        this.$router.push('/profile');
      }
    },
  },
  beforeMount() {
    this.isLoggedin();
  },
};
</script>

<style scoped>
  .fill {
    /* width: 100%;
    height: 100%;
    background-color: wheat; */
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/home-pic.jpg);
    background-size: cover;
    background-repeat: no-repeat;
  }
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  h1.title {
    font-family: 'Kaushan Script', cursive;
    color: #fff;
  }
  .title2 {
    color: #fff;
  }
  .slogan {
    margin: 5%;
    font-family: 'Trebuchet MS';
  }
  .home-wrap{
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: cover;
    background-repeat: no-repeat;
  }
</style>
