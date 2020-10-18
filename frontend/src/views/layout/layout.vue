<template>
  <section class="layout">
    <navbar/>
    <section class="container">
      <sidebar/>
      <main class="content">
        <transition name="content">
          <router-view class="inner"/>
        </transition>
      </main>
    </section>
  </section>
</template>

<script>
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';

export default {
  name: 'layout',
  components: { Navbar, Sidebar },
};
</script>

<style>

</style>
