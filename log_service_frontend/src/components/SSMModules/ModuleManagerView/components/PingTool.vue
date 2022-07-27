<template>
  <div>
    <div class="ping-opt d-flex" style="width:200px">
      <div>IP:</div>
      <div>
        <el-input v-model="ip"></el-input>
      </div>
      <div>
        <el-button
          @click="PingBtnHandle"
          :type=" pinging?'danger':'primary'"
        >{{ pinging?'STOP':'PING' }}</el-button>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="msg-container">
      <div v-for="msg in revMsgList" :key="msg">{{msg}}</div>
    </div>
  </div>
</template>

<script>
import { configs } from '@/config'
export default {
  data() {
    return {
      ip: "192.168.0.1",
      ws: null,
      revMsgList: [],
      pinging: false
    }

  },
  methods: {
    PingBtnHandle() {
      if (!this.pinging) {

        this.revMsgList = [`Ping ${this.ip} (使用32位元組的資料):`];
        this.ws = new WebSocket(`${configs.websocket_host}/ping/${this.ip}`);
        this.ws.onopen = () => {
          console.info('ping ws connected');
          this.pinging = true;
        }
        this.ws.onmessage = (ws) => {

          this.revMsgList.push(ws.data);
          if (ws.data == "IP Format Incorrect") {
            this.pinging = false;
            this.ws.close();
          }
        }
      } else {
        this.PingSTopBtnHandle();
      }
    },
    PingSTopBtnHandle() {
      this.ws.send('stop');
      this.ws.close();
      this.pinging = false;
    }
  },
}
</script>

<style  scoped>
.msg-container {
  border: 1px solid grey;
  overflow-y: scroll;
  height: 250px;
  background-color: black;
  border-radius: 4px;
  color: white;
  text-align: left;
  padding: 10px;
}

.ping-opt div {
  margin-right: 2px;
}
</style>