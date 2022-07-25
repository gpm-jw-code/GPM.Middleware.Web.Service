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
            <b-button variant="primary" @click="PingBtnHandle">PING</b-button>
          </template>
        </b-input-group>
      </div>
    </b-card>
  </div>
</template>

<script>
import { AddModule } from '@/APIHelpers/BackendAPIs'
export default {
  data() {
    return {
      ip: "127.0.0.1",
      port: 5000
    }
  }, methods: {
    async AddBtnHandle() {
      await AddModule(this.ip, this.port);
      this.$emit("OnModuleAdd", {});
    },
    async PingBtnHandle() {

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