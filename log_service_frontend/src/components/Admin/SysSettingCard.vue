<template >
  <div class="card system-setting-card" style="width:100%;" v-loading="loading">
    <div class="card-body">
      <div class="d-flex">
        <h5 class="card-title">SETTINGS</h5>
        <div class="d-flex justify-content-end w-100">
          <div
            v-show="!settingLock"
            class="btn-group !spacing"
            role="group"
            aria-label="Basic example"
          >
            <a class="btn btn-light btn-sm" @click="ApplySettingHandle" role="button">Apply</a>
            <a class="btn btn-danger btn-sm" @click="CancelSettingHandle" role="button">Cancel</a>
          </div>
          <el-icon class="my-2 mx-2" @click="settingLock=!settingLock">
            <lock v-if="settingLock"></lock>
            <unlock v-else></unlock>
          </el-icon>
        </div>
      </div>
      <el-divider></el-divider>

      <h6>
        <b>TCP Connection</b>
      </h6>
      <!-- <el-row :gutter="10">
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
      -->
      <el-row :gutter="10">
        <el-col :span="9">TCP Server Port</el-col>
        <el-col :span="4" class="input-item-col">
          <el-input
            :disabled="settingLock"
            type="number"
            v-model="settings.servers.tcpServerPort"
            :min="0"
            style="width:120px"
          ></el-input>
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
import { GetSystemSettings, SetSystemSettings } from '@/APIHelpers/BackendAPIs'
export default {
  data() {
    return {
      loading: true,
      settingLock: true,
      settings: {
        tcpClient: {
          autoKickOutClient: true,
          connectionLimits: 10
        },
        servers: {
          tcpServerPort: 0
        }
      }
    }
  },
  methods: {
    async FetchSettingFromBackend() {
      this.loading = true;
      this.settings = await GetSystemSettings();
      this.loading = false;
    },
    async ApplySettingToBackend() {
      this.settings = await SetSystemSettings(this.settings);
    },
    CancelSettingHandle() {
      //TODO Restore 
      this.FetchSettingFromBackend();
      this.settingLock = true;
    },
    async ApplySettingHandle() {
      //TODO Send Req to backend
      await this.ApplySettingToBackend();
      this.settingLock = true;
    }
  },
  mounted() {
    this.FetchSettingFromBackend();
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