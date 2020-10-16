<template>
  <el-card class="box-card" height="100%">
    <div slot="header" class="clearfix">
      <span>Liang Boyuan</span>
    </div>
    <div class="bar-btn">
      <el-button type="primary" plain>search for service</el-button>
    </div>
    <div class="bar-btn">
      <el-button type="primary" plain>my pets</el-button>
    </div>
    <div class="bar-btn">
      <el-button type="primary" plain>my orders</el-button>
    </div>
    <div class="bar-btn">
      <el-button type="primary" plain>back to home</el-button>
    </div>
  </el-card>
</template>

<style>
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
