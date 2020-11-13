<template>
  <header>
    <ul>
      <li class="right" @click="logout">
        <p>Log Out</p>
      </li>
      <li class="right" @click="linkClicked('/caretaker')">
        <p :class="$route.path.split('/')[1]==='/caretaker'?'active':''">Care Taker</p>
      </li>
      <li class="right" @click="linkClicked('/petowner')">
        <p :class="$route.path.split('/')[1]==='/po'?'active':''">Pet Owner</p>
      </li>
      <li class="left title" @click="linkClicked('/')">
        <p class="title-text">Pet-Anything</p>
      </li>
      <li class="right" @click="linkClicked('/profile')">
        <p :class="$route.path.split('/')[1]==='/profile'?'active':''">Profile</p>
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
        if (this.$router.currentRoute.path === '/profile') {
          if (route === '/') {
            return;
          }
        }
        this.$router.push(route);
      }
    },
    logout() {
      this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/');
        })
        .catch(({ error }) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
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
    background-color:rgb(59, 89, 152);
  }

  .title-text {
    position: relative;
    top: -2px;
    font-family: 'Kaushan Script', cursive;
    color: #fff;
    font-weight: bold;
  }

  li {
    position: relative;
    top: 1px;
    cursor: pointer;
  }

  li p {
    display: block;
    color: #fff;
    text-align: center;
    padding: 16px 16px;
    text-decoration: none;
    font-family: 'Courgette', cursive;
  }

  li p:hover:not(.active):not(.title-text) {
    background-color: #87CEEB;
  }

  .active {
    background-color: #87CEEB;
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
