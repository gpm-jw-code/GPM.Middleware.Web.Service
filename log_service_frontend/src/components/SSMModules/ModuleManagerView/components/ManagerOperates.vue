<template>
  <div class="ssm-manager-opt">
    <b-card>
      <div>
        <b-input-group>
          <template #prepend>
            <b-input-group-text>IP</b-input-group-text>
            <b-form-input style="width:100px" v-model="ip" size="md"></b-form-input>
            <b-input-group-text>Port</b-input-group-text>
            <b-form-input number v-model="port" size="md"></b-form-input>
          </template>

          <template #append>
            <b-button @click="AddBtnHandle">新增</b-button>
            <b-button variant="primary" @click="PingBtnHandle">PING 工具</b-button>
          </template>
        </b-input-group>
      </div>
    </b-card>

    <el-drawer v-model="showPingTool" direction="btt" title="Ping Tool" size="50%">
      <PingTool></PingTool>
    </el-drawer>
  </div>
</template>

<script>
import { AddModule } from '@/APIHelpers/BackendAPIs'
import { ElMessage } from 'element-plus';
import PingTool from "./PingTool.vue"

export default {
  components: {
    PingTool,
  },
  data() {
    return {
      ip: "127.0.0.1",
      port: 5000,
      showPingTool: false
    }
  }, methods: {
    async AddBtnHandle() {
      await AddModule(this.ip, this.port);
      this.$emit("OnModuleAdd", {});
      ElMessage({ showClose: true, type: 'success', message: '新增完成' })
    },
    async PingBtnHandle() {
      this.showPingTool = true;
    }
  }
}
</script>

<style>
.ssm-manager-opt {
  /* background-color: brown; */
  /* color: white; */
  width: 550px;
  padding: 10px;
}
</style>