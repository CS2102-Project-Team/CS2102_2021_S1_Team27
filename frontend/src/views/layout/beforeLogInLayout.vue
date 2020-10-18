<template>
  <section class="layout">
    <BeforeLogInNavbar/>
      <main class="content">
        <transition name="content">
          <router-view class="inner"/>
        </transition>
      </main>
  </section>
</template>

<script>
import BeforeLogInNavbar from '@/components/loginsignupnavbar';

export default {
  name: 'layout',
  components: { BeforeLogInNavbar },
};
</script>

<style>

</style>
