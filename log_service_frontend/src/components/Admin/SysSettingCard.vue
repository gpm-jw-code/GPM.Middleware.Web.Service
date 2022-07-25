<template >
  <div class="card system-setting-card" style="width:100%;">
    <div class="card-body">
      <h5 class="card-title">SETTINGS</h5>
      <el-divider></el-divider>
      <h6>
        <b>TCP Connection</b>
      </h6>
      <el-row :gutter="10">
        <el-col :span="9">AUTO KICK OUT CLIENT</el-col>
        <el-col :span="4" class="input-item-col">
          <el-switch v-model="settings.tcpClient.autoKickOutClient" size></el-switch>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="9">Connection Limits</el-col>
        <el-col :span="4" class="input-item-col">
          <el-input-number v-model="settings.tcpClient.connectionLimits"></el-input-number>
        </el-col>
      </el-row>

      <el-divider></el-divider>
      <h6>
        <b>Devices</b>
      </h6>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      settings: {
        tcpClient: {
          autoKickOutClient: true,
          connectionLimits: 10
        }
      }
    }
  }
}
</script>
<style>
.system-setting-card h6 {
  text-align: left;
}

.system-setting-card .el-col {
  text-align: left;
  margin-left: 1rem;
}

.system-setting-card .el-col .input-item-col {
  text-align: center;
}
</style>