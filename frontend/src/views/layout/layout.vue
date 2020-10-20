<template>
  <section class="layout">
    <BeforeLogInNavbar v-if="['/', '/login', '/signup'].includes($route.path)" />
    <Navbar v-else />
      <main class="content">
        <transition name="content">
          <router-view class="inner"/>
        </transition>
      </main>
  </section>
</template>

<script>
import BeforeLogInNavbar from '@/components/loginsignupnavbar';
import Navbar from '@/components/navbar';

export default {
  name: 'layout',
  components: { BeforeLogInNavbar, Navbar },
};
</script>

<style>

</style>
