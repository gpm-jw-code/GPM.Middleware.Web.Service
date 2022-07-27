<template >
  <div>
    <el-divider></el-divider>
    <p>System Start Time : {{AppStartTime}}</p>
    <div class="row">
      <div class="col-lg-4">
        <SysSettingCard></SysSettingCard>
      </div>
      <div class="col-lg-4">
        <PCStateCard :pcState="app_states.pcState"></PCStateCard>
      </div>
      <div class="col-lg-4">
        <SSMInfoCard :ssmNumber="app_states.ssmNumber"></SSMInfoCard>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-8">
        <TcpIPClientListCard :tcpClientState="app_states.tcpClientState"></TcpIPClientListCard>
      </div>
      <div class="col-lg-4">
        <SystemOperation></SystemOperation>
      </div>
    </div>
  </div>
</template>
<script>
import { GetAppStates } from '../APIHelpers/BackendAPIs.js'
import SysSettingCard from '../components/Admin/SysSettingCard.vue'
import TcpIPClientListCard from '../components/Admin/TcpIPClientListCard.vue'
import PCStateCard from '../components/Admin/PCStateCard.vue'
import SSMInfoCard from '../components/Admin/SSMInfoCard.vue'
import SystemOperation from '../components/Admin/SystemOperation.vue'

import moment from 'moment';
import { configs } from '@/config.js'
export default {
  components: { SysSettingCard, TcpIPClientListCard, SSMInfoCard, PCStateCard, SystemOperation },

  data() {
    return {
      app_states: {},

    }
  },
  computed: {
    AppStartTime() {
      return moment(this.app_states.startupTime).format('yyyy/MM/DD HH:mm:ss');
    }
  },
  methods: {
    async FetchAppState() {
      this.app_states = await GetAppStates();
    },
    async WebsocketConnect() {
      var ws = new WebSocket(`${configs.websocket_host}/app_states`);
      ws.onopen = () => { console.info('ws opend..') };
      ws.onclose = () => { console.info('ws closed..') };
      ws.onmessage = (_ws) => this.HandleWSMessage(_ws);
    },
    HandleWSMessage(ws = WebSocket) {
      console.info(ws.data);
      this.app_states = JSON.parse(ws.data);
    }

  },
  mounted() {
    this.FetchAppState();
    this.WebsocketConnect();
  },
}
</script>
<style >
.row {
  margin: 3px;
}
</style>