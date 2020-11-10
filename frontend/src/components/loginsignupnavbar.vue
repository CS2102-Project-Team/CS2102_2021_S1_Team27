<template>
  <header>
    <ul>
      <li class="left title" @click="linkClicked('/')">
        <p class="title-text">Pet-Anything</p>
      </li>
      <li class="right" @click="linkClicked('/signup')">
        <p :class="$route.path==='/signup'?'active':''">Sign Up</p>
      </li>
      <li class="right" @click="linkClicked('/login')">
        <p :class="$route.path==='/login'?'active':''">Login</p>
      </li>
    </ul>
  </header>
</template>

<script>

export default {
  name: 'navbar',
  methods: {
    linkClicked(route) {
      if (route !== this.$router.currentRoute.path) {
        this.$router.push(route);
      }
    },
  },
};
</script>

<style scoped>
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color:#FFFAFA;
  }

  .title-text {
    position: relative;
    top: -2px;
    font-family: 'Kaushan Script', cursive;
    color: slateblue;
    font-weight: bold;
  }

  li {
    position: relative;
    top: 1px;
    cursor: pointer;
  }

  li p {
    display: block;
    color: #5B2C6F;
    text-align: center;
    padding: 16px 16px;
    text-decoration: none;
    font-family: 'Courgette', cursive;
  }

  li p:hover:not(.active):not(.title-text) {
    background-color: #F0F8FF;
  }

  .active {
    background-color: #FAEBD7;
  }

  .title {
    padding-left: 1%;
  }

  .left {
    float: left;
  }

  .right {
    float: right;
  }
</style>
