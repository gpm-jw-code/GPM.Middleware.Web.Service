<template>
  <div>
    <div class="edge-status mx-1 my-1 d-flex flex-column h-100">
      <div class="d-flex flex-row border-bottom mb-4" v-bind:style="TitleColor">
        <div class="title d-flex flex-column px-1">
          <h3>
            <i class="bi bi-diagram-2"></i>
            {{EdgeProp.Name.toUpperCase()}}
          </h3>
          <span>{{EdgeProp.EdgeIP}}</span>
        </div>
        <div class="flex-fill d-flex flex-row justify-content-end">
          <span class="network-status-label py-3">網路狀態</span>
          <NetworkStatusVue :ip="EdgeProp.EdgeIP" toolTipPosition="bottom"></NetworkStatusVue>
        </div>
      </div>

      <!-- <div class="show-types">
        <el-radio-group v-model="DisplayMode">
          <el-radio-button label="Overview"></el-radio-button>
          <el-radio-button label="Performance"></el-radio-button>
        </el-radio-group>
      </div>-->
      <div class="d-flex flex-row justify-content-center flex-fill" v-loading="loading">
        <!-- 感測器數量與IDMS運行狀態 -->
        <div v-if="DisplayMode=='Overview'" class="d-flex flex-row justify-content-center">
          <div>
            <el-progress
              type="circle"
              :percentage="100"
              :width="circleWidth"
              :status="IDMSAlive ? 'success':'exception'"
            >
              <div class="value-num-div">
                <div class>IDMS</div>
                <div
                  class="value-num"
                  v-bind:class="IDMSAlive?'Online':'Offline'"
                >{{IDMSAlive?'ONLINE':'OFFLINE'}}</div>
              </div>
            </el-progress>
            <div class="shadow"></div>
          </div>
          <div>
            <el-progress type="circle" :percentage="100" :width="circleWidth" status="primary">
              <div class="value-num-div">
                <div>感測器數量</div>
                <div class="value-num connected-num">
                  <count-to
                    :startVal="edgeStatusFromIDMS_old.OnlineSensorNum==-1? 0:edgeStatusFromIDMS_old.OnlineSensorNum"
                    :endVal="edgeStatusFromIDMS.OnlineSensorNum"
                    :duration="2100"
                  ></count-to>
                </div>
              </div>
            </el-progress>
            <div class="shadow"></div>
          </div>
          <div>
            <el-progress
              type="circle"
              :percentage="edgeStatusFromIDMS.Health"
              :width="circleWidth"
              :status="health_state"
            >
              <div class="value-num-div">
                <div>
                  健康度
                  <el-popover width="300" placement="top-start" content="表示所有監測點中其健康分數高於Alarm閥值的比率">
                    <template #reference>
                      <el-icon class="mb-2" color="rgb(204, 204, 204)">
                        <InfoFilled></InfoFilled>
                      </el-icon>
                    </template>
                  </el-popover>
                </div>
                <div class="value-num" v-bind:class="'health-'+health_state">
                  <count-to
                    :startVal="edgeStatusFromIDMS_old.Health"
                    :endVal="edgeStatusFromIDMS.Health"
                    :duration="2100"
                  ></count-to>
                </div>
              </div>
            </el-progress>
            <div class="shadow"></div>
          </div>
          <!-- <div>
            <el-progress type="circle" :percentage="100" :width="circleWidth" status="primary">
              <div class="value-num-div">
                <div>健康度</div>
                <div class="value-num connected-num">
                  <count-to
                    :startVal="0"
                    :endVal="edgeStatusFromIDMS.OnlineSensorNum"
                    :duration="2100"
                  ></count-to>
                </div>
              </div>
            </el-progress>
            <div class="shadow"></div>
          </div>-->
        </div>
        <!-- Performance -->
        <div v-else class="d-flex flex-row justify-content-center">
          <div>
            <el-progress
              type="circle"
              :percentage="PerformanceData.cpu"
              :width="circleWidth"
              status="primary"
            >
              <div class="value-num-div">
                <div>CPU</div>
                <div class="value-num connected-num">
                  <count-to :startVal="0" :endVal="PerformanceData.cpu" :duration="2100"></count-to>
                </div>
              </div>
            </el-progress>
            <div class="shadow"></div>
          </div>
          <div>
            <el-progress
              type="circle"
              :percentage="PerformanceData.ram"
              :width="circleWidth"
              :status="IDMSAlive ? 'success':'exception'"
            >
              <div class="value-num-div">
                <div class>RAM</div>
                <div
                  class="value-num"
                  v-bind:class="IDMSAlive?'Online':'Offline'"
                >{{PerformanceData.ram}}</div>
              </div>
            </el-progress>
            <div class="shadow"></div>
          </div>
        </div>
      </div>
      <div class="d-flex flex-row">
        <div class="edge-state-timestamp w-100 text-start">
          <i class="bi bi-caret-down"></i>
          {{TIME_STAMP}}
        </div>
        <div class="edge-state-timestamp w-100 text-end">
          <i class="bi bi-server"></i>
          資料庫使用: {{EdgeProp.DbDickUsage}}
        </div>
      </div>
      <div class="my-2">
        <div class="d-flex flex-row">
          <b-button
            v-bind:class="EnterButtonColorMode"
            class="flex-fill"
            @click="EnterEdgeHandle"
          >Enter</b-button>

          <!-- <b-button
          v-bind:class="[EnterButtonColorMode,'bg-primary']"
          @click="EnterEdgeHandle"
        >Overview</b-button>
        <b-button
          v-bind:class="[EnterButtonColorMode,'bg-primary']"
          @click="performance = !performance"
          >Performance</b-button>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NetworkStatusVue from '../../components/NetworkStatus.vue';
import { GetPCPerformance } from '@/APIHelpers/MicroServices/Performance.js'
import { configs } from '@/config';
import moment from 'moment';
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
          Status: 'Offline',
          DbDickUsage: '?'
        }
      }
    },
    ColorMode: {
      type: String,
      default: 'bg-dark'
    },
    Mode: {
      type: String,
      default: 'list'
    }
  },
  computed: {
    TitleColor() {
      return { color: this.ColorMode == 'bg-dark' ? '#939393' : 'black' }
    },
    EnterButtonColorMode() {
      return this.ColorMode == 'bg-dark' ? 'bg-dark' : 'bg-primary'
    },
    health_state() {
      return this.edgeStatusFromIDMS.Health > 80 ? 'success' : (this.edgeStatusFromIDMS.Health <= 50 ? 'exception' : 'warning')
    },
    TIME_STAMP() {
      return moment(this.edgeStatusFromIDMS.TimeStamp).format('yyyy-MM-DD HH:mm:ss');
    },
    circleWidth() {
      return window.innerWidth < 500 ? 100 : 160;
    }
  },
  data() {
    return {
      DisplayMode: "Overview",
      performance: false,
      loading: true,
      edgeStatusWebsocket: null,
      edgeStatusFromIDMS_old: {
        OnlineSensorNum: -1,
        Health: 30
      },
      edgeStatusFromIDMS: {
        OnlineSensorNum: -1,
        Health: 30,
        TimeStamp: '2022/04/18'
      },
      IDMSAlive: false,
      PerformanceData: {
        cpu: 0,
        ram: 0
      },
      PerformanceDataTimer: null
    }
  },
  methods: {
    EnterEdgeHandle() {

      // this.$router.push(`/EdgeMain/${this.EdgeProp.EdgeIP}`);
      this.$router.push({ path: '/EdgeMain', query: { ip: this.EdgeProp.EdgeIP, edgename: this.EdgeProp.Name } });
      //   this.$router.push(`/EdgeMain`);
    },
    WebsocketIni() {
      try {
        this.edgeStatusWebsocket = new WebSocket(`${configs.websocket_host}/EdgeStatus?edgeIP=${this.EdgeProp.EdgeIP}`);
        this.edgeStatusWebsocket.onmessage = (evt) => {
          this.edgeStatusFromIDMS = JSON.parse(evt.data);
          this.edgeStatusFromIDMS.Health = this.edgeStatusFromIDMS.Health == undefined ? 100 : this.edgeStatusFromIDMS.Health;
          this.IDMSAlive = true;
          this.loading = false;
          this.edgeStatusFromIDMS_old = JSON.parse(JSON.stringify(this.edgeStatusFromIDMS));
        }
        this.edgeStatusWebsocket.onclose = () => {
          this.WebsocketClear();
          this.WebsocketIni();
          this.IDMSAlive = false;
          this.loading = false;
        }
        this.edgeStatusWebsocket.onerror = (err) => {
          this.WebsocketClear();
          this.WebsocketIni();
          this.IDMSAlive = false;
          this.loading = false;
        }
      } catch (error) {
        this.IDMSAlive = false;
        this.loading = false;
      }
    },
    WebsocketClear() {
      if (this.edgeStatusWebsocket != null) {
        this.edgeStatusWebsocket.onclose = null;
        this.edgeStatusWebsocket.onerror = null;
        this.edgeStatusWebsocket.close();
        this.edgeStatusWebsocket = null;
      }
    }
  },
  mounted() {
    //this.PerformanceDataTimer = setInterval(() => GetPCPerformance(this.EdgeProp.EdgeIP).then(ret => this.PerformanceData = ret), 1000)
    this.WebsocketIni();
  },
  unmounted() {
    //clearInterval(this.PerformanceDataTimer);
    this.WebsocketClear();
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
  padding-top: 0px;
  margin-top: -10px;
}
.edge-status .title {
  text-align: left;
  padding: 0;
  margin: 0;
}
.edge-status .el-progress {
  margin: 10px;

  text-shadow: 33px 1px 10px 2px rgb(10, 10, 10);
}
/* .edge-status:hover {
  background-color: rgb(187, 214, 253);
  color: white;
  cursor: pointer;
} */

.network-status-label {
  font-size: 8px;
  color: rgb(129, 129, 129);
}

.value-num-div {
  color: grey;
}

.value-num-div .connected-num {
  /* font-size: 48px; */
  color: rgb(32, 160, 255);
  margin: 0;
}

.value-num {
  font-size: 32px;
  padding-top: 10px;
  font-weight: bold;
}
.Offline {
  color: red;
}

.Online {
  color: rgb(19, 206, 102);
}

@media screen and (max-width: 500px) {
  .Online,
  .Offline {
    font-size: 1.2rem;
  }
}

.shadow {
  margin: auto 10px;
  height: 11px;
  /* box-shadow: 10px -2px 10px 12px black; */
  position: relative;
  top: -18px;
  opacity: 0.7;
}

.show-types {
  margin-top: -20px;
  letter-spacing: normal;
  text-align: left;
}

.health-success {
  color: rgb(19, 206, 102);
}

.health-warning {
  color: rgb(230, 162, 60);
}

.health-exception {
  color: rgb(245, 108, 108);
}

.edge-state-timestamp {
  color: grey;
  font-size: 12px;
}
</style>