<template>
  <div class="col-lg card" style="width:100%;">
    <div class="card-body">
      <h5 class="card-title">SSM STATES</h5>
      <el-divider></el-divider>
      <div class="justify-content-center states-container">
        <div>CONNECTED NUMBER</div>
        <div id="ssm-number">{{ssmNumber}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    ssmNumber: {
      type: Number,
      default: 0
    }
  }
}
</script>
<style>
#ssm-number {
  font-size: 80px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>