<template>
  <div class="col-lg card" style="width:100%;">
    <div class="card-body">
      <h5 class="card-title">PC STATES</h5>
      <el-divider></el-divider>

      <div class="d-flex justify-content-center states-container">
        <el-row :gutter="30">
          <el-col :span="12">
            <div>
              <u>RAM</u>
            </div>
            <el-progress type="circle" :percentage="pcState.ram"></el-progress>
          </el-col>
          <el-col :span="12">
            <div>
              <u>CPU</u>
            </div>
            <el-progress type="circle" :percentage="pcState.cpu"></el-progress>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    pcState: {
      type: Object,
      default() {
        return {
          ram: 23,
          cpu: 20.2
        }
      }
    }
  }
}
</script>
<style>
.states-container .el-col {
}
</style>