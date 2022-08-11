<template>
  <div class="edge-status mx-1 my-1" @click="EnterEdgeHandle" v-loading="loading">
    <div class="d-flex flex-row" v-bind:style="TitleColor">
      <div class="title d-flex flex-column px-1">
        <h3>{{EdgeProp.Name.toUpperCase()}}</h3>
        <span>{{EdgeProp.EdgeIP}}</span>
      </div>

      <div class="flex-fill d-flex flex-row justify-content-end">
        <span class="network-status-label py-1">網路狀態</span>
        <NetworkStatusVue :ip="EdgeProp.EdgeIP" toolTipPosition="bottom"></NetworkStatusVue>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="d-flex flex-row justify-content-center">
      <div>
        <el-progress type="circle" :percentage="100" :width="circleWidth" status="primary">
          <div class="sensor-num-div">
            <div>感測器數量</div>
            <div class="sensor-num connected-num">
              <count-to :startVal="0" :endVal="edgeStatusFromIDMS.OnlineSensorNum" :duration="2100"></count-to>
            </div>
          </div>
        </el-progress>
        <div class="shadow"></div>
      </div>
      <div>
        <el-progress
          type="circle"
          :percentage="100"
          :width="circleWidth"
          :status="IDMSAlive ? 'success':'exception'"
        >
          <div class="sensor-num-div">
            <div class>IDMS</div>
            <div
              class="sensor-num"
              v-bind:class="IDMSAlive?'Online':'Offline'"
            >{{IDMSAlive?'ONLINE':'OFFLINE'}}</div>
          </div>
        </el-progress>
        <div class="shadow"></div>
      </div>
    </div>
    <div class="my-2">
      <b-button v-bind:class="EnterButtonColorMode" class="w-100" @click="EnterEdgeHandle">Enter</b-button>
    </div>
  </div>
</template>

<script>
import NetworkStatusVue from '../../components/NetworkStatus.vue';
export default {
  components: {
    NetworkStatusVue,
  },
  props: {
    EdgeProp: {
      type: Object,
      default() {
        return {
          Name: 'Line-2',
          EdgeIP: "127.0.0.1",
          SensorNum: 10,
          Status: 'Offline'
        }
      }
    },
    ColorMode: {
      type: String,
      default: 'bg-dark'
    }
  },
  computed: {
    TitleColor() {
      return { color: this.ColorMode == 'bg-dark' ? '#939393' : 'black' }
    },
    EnterButtonColorMode() {
      return this.ColorMode == 'bg-dark' ? 'bg-dark' : 'bg-primary'

    }
  },
  data() {
    return {
      loading: true,
      edgeStatusWebsocket: null,
      circleWidth: 170,
      edgeStatusFromIDMS: {
        OnlineSensorNum: -1
      },
      IDMSAlive: false
    }
  },
  methods: {
    EnterEdgeHandle() {
      localStorage.setItem('edgeip', this.EdgeProp.EdgeIP);
      localStorage.setItem('edgename', this.EdgeProp.Name.toLowerCase());
      this.$router.push(`/EdgeMain/${this.EdgeProp.EdgeIP}`);
      //   this.$router.push(`/EdgeMain`);
    }
  },
  mounted() {

    try {
      this.edgeStatusWebsocket = new WebSocket(`ws://${this.EdgeProp.EdgeIP}:44332/EdgeStatus`);
      this.edgeStatusWebsocket.onmessage = (evt) => {
        this.edgeStatusFromIDMS = JSON.parse(evt.data);
        this.IDMSAlive = true;
        this.loading = false;
      }
      this.edgeStatusWebsocket.onclose = () => {
        console.info('edge ws close ');
        this.IDMSAlive = false;
        this.loading = false;
      }
      this.edgeStatusWebsocket.onerror = (err) => {
        this.IDMSAlive = false;
        this.loading = false;
        console.info('edge ws ', err);

      }
    } catch (error) {
      console.info('edge ws ', error);
      this.IDMSAlive = false;
      this.loading = false;
    }

  },
  unmounted() {
    this.edgeStatusWebsocket.onclose = null;
    this.edgeStatusWebsocket.onerror = null;
    this.edgeStatusWebsocket.close();
  }
}
</script>

<style>
.edge-status {
  border-radius: 10px;
}
.edge-status h3 {
  letter-spacing: 0.21rem;
  font-weight: bolder;
}
.edge-status span {
  letter-spacing: 0.11rem;
  padding-top: 2px;
}
.edge-status .title {
  text-align: left;
}
.edge-status .el-progress {
  margin: 10px;

  text-shadow: 33px 1px 10px 2px rgb(10, 10, 10);
}
.edge-status:hover {
  background-color: rgb(187, 214, 253);
  color: white;
  cursor: pointer;
}

.network-status-label {
  font-size: 8px;
  color: rgb(129, 129, 129);
}

.sensor-num-div {
  color: grey;
}

.sensor-num-div .connected-num {
  font-size: 58px;
  color: rgb(32, 160, 255);
  margin: 0;
}

.sensor-num {
  font-size: 38px;
  margin: 10px;
  font-weight: bold;
}
.Offline {
  color: red;
}

.Online {
  color: rgb(19, 206, 102);
}

.shadow {
  margin: auto 10px;
  height: 11px;
  /* box-shadow: 10px -2px 10px 12px black; */
  position: relative;
  top: -18px;
  opacity: 0.7;
  transform: skewY(-4deg);
}
</style>