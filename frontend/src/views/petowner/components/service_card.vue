<template>
  <el-card>
    <span style='color:red'>{{ realname }}</span>
    <br/>
    <span>{{ address }}</span>
    <br/>
    <span>{{ rating }}</span>
    <br/>
    <span>{{ totalprice }}</span>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      realname: 'testcaretaker1',
      address: '119 Dover Road, 139656',
      rating: '4.5',
      totalprice: '80000',
    };
  },
};
</script>

<style scoped>
</style>
