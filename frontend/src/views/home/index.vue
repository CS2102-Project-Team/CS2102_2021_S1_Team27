<template>
  <div class="center fill">
    <h1>Welcome to</h1>
    <h1 class="title">Pet-Anything</h1>
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
    width: 100%;
    height: 100%;
    background-color: wheat;
  }
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  h1.title {
    font-family: 'Kaushan Script', cursive;
  }
</style>
