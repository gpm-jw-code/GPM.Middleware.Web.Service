<template>
  <el-drawer direction="btt" size="90%" v-model="show" @closed="CloseHandle" :show-close="false">
    <template #header="{ titleId}">
      <div :id="titleId" class="ve-detail-title d-flex flex-row">
        <div class="flex-fill">{{`振動能量-${veData.EqName}/${veData.UnitName}(${ip})`}}</div>
        <el-button size="large" plain icon="close" circle @click="show=false"></el-button>
      </div>
    </template>
    <div class="h-100 w-100 ve-detail-content" v-loading="!wsDataRecieved">
      <div
        class="axis-infos d-flex flex-column"
        v-for="(data , axis) in veData.AxisStatus"
        :key="axis"
      >
        <div class="axis-title d-flex justify-content-start w-100 px-3">{{axis}} 軸向</div>
        <div class="content d-flex flex-row justify-content-start h-100">
          <div
            class="value-thres-container d-flex flex-column bg-dark"
            v-bind:class="data.IsOutOfSPC? 'value-red':'value-green'"
          >
            <div class="value-display">{{data.veValue.toFixed(3)}}</div>
            <!-- 閥值 -->
            <div class="threshold-setting border-top w-100">
              <div class="row w-100">
                <div v-if="ThresholdSettinglock[axis]" class="col-sm-9 text-start">
                  <span>UCL</span>
                  <input disabled :value="data.ucl" type="number" step="0.01" />
                  <span>LCL</span>
                  <input disabled :value="data.lcl" type="number" step="0.01" />
                </div>
                <!-- 設定中顯示 -->
                <div
                  class="col-sm-8 setting-mode text-start"
                  v-else
                  v-loading="ThresholdSetting[axis].loading"
                >
                  <span>UCL</span>
                  <b-form-input
                    class="setting-input"
                    v-model.number="ThresholdSetting[axis].ucl"
                    type="number"
                    step="0.01"
                  />
                  <span>LCL</span>
                  <b-form-input
                    class="setting-input"
                    v-model.number="ThresholdSetting[axis].lcl"
                    type="number"
                    step="0.01"
                  />
                </div>
                <el-button
                  class="col-sm-3"
                  size="small"
                  v-show="ThresholdSettinglock[axis]"
                  @click="UnlockClickHandle(axis)"
                >Unlock</el-button>
                <el-button
                  class="col-sm-2"
                  size="small"
                  v-show="!ThresholdSettinglock[axis]"
                  @click="SettingThersHoldHandle(axis)"
                >儲存</el-button>
                <el-button
                  class="col-sm-2"
                  size="small"
                  v-show="!ThresholdSettinglock[axis]"
                  @click="ThresholdSettinglock[axis]=true"
                >取消</el-button>
              </div>
            </div>
          </div>

          <div class="charting flex-fill col-md-6">
            <GPMChart
              class="vechart"
              :ref="chart_id+'_'+axis"
              :chart_id="chart_id+'_'+axis"
              :title="`[${axis}]軸向振動能量趨勢圖`"
              yAxisLabel="振動能量(G)"
            ></GPMChart>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import GPMChart from '@/components/Charting/GPMChart.vue'
import { configs } from '@/config';
export default {
  components: { GPMChart },
  props: {
    ip: {
      type: String,
      default: '123.213.213.23'
    },
    edge_ip: {
      type: String,
      default: '123.213.213.23'
    },

  },
  computed: {
    chart_id() {
      return this.ip + '_ve_detail_chart';
    }
  },
  data() {
    return {
      show: false,
      wsDataRecieved: false,
      ws: null,
      veData: {
        IP: "",
        EqName: "",
        UnitName: "",
        AxisStatus: {
          X: {
            status: 'normal',
            veValue: 0
          },
          Y: {
            status: 'warning',
            veValue: 0
          },
          Z: {
            status: 'danger',
            veValue: 0
          }
        }
      },
      ThresholdSettinglock: {
        X: true,
        Y: true,
        Z: true,
      },
      ThresholdSetting: {
        X: {
          ucl: 1,
          lcl: 1,
          loading: false
        },
        Y: {
          ucl: 1,
          lcl: 1,
          loading: false
        },
        Z: {
          ucl: 1,
          lcl: 1,
          loading: false
        }
      }
    }
  },
  methods: {
    Show() {
      this.show = true
      this.WsIni();
    },
    UnlockClickHandle(axis) {
      let ucl = this.veData.AxisStatus[axis].ucl;
      let lcl = this.veData.AxisStatus[axis].lcl;
      this.ThresholdSetting[axis].ucl = ucl;
      this.ThresholdSetting[axis].lcl = lcl;
      this.ThresholdSettinglock[axis] = false;
    },
    SettingThersHoldHandle(axis) {
      this.ThresholdSetting[axis].loading = true;
      setTimeout(() => {
        let ws = new WebSocket(`ws://${this.edge_ip}:44332/VibrationEnergy/ThresholdSetting?ip=${this.ip}&axis=${axis}&ucl=${this.ThresholdSetting[axis].ucl}&lcl=${this.ThresholdSetting[axis].lcl}`);
        ws.onmessage = (evt) => {
          var response = JSON.parse(evt.data);
          ws.onmessage = null;
          ws.close();
          setTimeout(() => {
            if (response.data) {
              this.$toast.info(`${this.ip} ${axis}軸閥值設定完成`);
            } else {
              this.$toast.error(`${this.ip} ${axis}軸閥值設定失敗!\r\n${response.message}`);
            }
            this.ThresholdSettinglock[axis] = true;
            this.ThresholdSetting[axis].loading = false;
          }, 500)
        };
        ws.onerror = (er) => {
          this.$toast.error(`${this.ip} ${axis}軸閥值設定失敗!\r\n${er.message}`);
          console.info('設定VE閥值時發生websocket error', er);
        }
      }, 50)
    },
    WsIni() {
      this.ws = new WebSocket(`${configs.websocket_host}/VibrationEnergy?edgeIP=${this.edge_ip}&sensorIP=${this.ip}&type=charting`);
      this.ws.onmessage = (evt) => this.WsDataHandle(JSON.parse(evt.data));
    },
    WsDataHandle(vm) {
      this.wsDataRecieved = true;
      this.veData = vm;
      if (!this.show)
        return;
      try {
        this.$refs[this.chart_id + '_X'][0].UpdateChart(this.veData.AxisStatus.X.charting);
        this.$refs[this.chart_id + '_Y'][0].UpdateChart(this.veData.AxisStatus.Y.charting);
        this.$refs[this.chart_id + '_Z'][0].UpdateChart(this.veData.AxisStatus.Z.charting);
      } catch (er) {
        console.error(er);
      }
    },
    CloseHandle() {
      if (this.ws != null) {
        this.ws.onmessage = null;
        this.ws.close();
      }
      this.wsDataRecieved = false;
    }
  },
  mounted() {
  }
}
</script>

<style>
.ve-detail-title {
  text-align: left;
  font-size: 27px;
  letter-spacing: 0.2rem;
  font-weight: bold;
}
.axis-title {
  font-size: 14px;
  background-color: rgb(24, 57, 107);
  color: white;
  font-weight: bold;
}
.value-display {
  font-size: 50px;
  padding: 30px;
  font-weight: bold;
  border-radius: 10px;
}

.threshold-setting {
  height: 30px;
  color: white;
  font-size: 12px;
  padding: 4px;
}

.threshold-setting input,
.threshold-setting setting-input {
  width: 73px;
  height: 25px;
  margin: auto 4px;
  text-align: center;
  display: inline;
}
.threshold-setting input:disabled {
  background-color: #33485d;
  color: rgb(212, 212, 212);
}

.setting-mode input {
  background-color: black;
  color: white;
}

.threshold-setting .el-button {
  margin: 0;
}
.axis-infos {
  background-color: #33485d;
  color: white;
  height: 34%;

  border-radius: 8px;
  box-shadow: -2px 1px 18px 5px rgb(58 58 58);
}

.vechart {
  height: 95%;
}

.value-thres-container {
  width: 23rem;
}

.value-red {
  color: red;
}
.value-green {
  color: rgb(0, 255, 0);
}
.ve-detail-content {
  overflow-y: scroll;
}
@media screen and (max-width: 700px) {
  .threshold-setting {
    padding: 0;
  }
  .threshold-setting .row {
    margin-left: -9px;
  }
  .ve-detail-title {
    font-size: 14px;
  }
  .value-display {
    font-size: 33px;
    padding: 0px;
  }
  .value-thres-container {
    width: 6rem;
  }
  .threshold-setting .el-button {
    margin: 11px;
    width: 88px;
  }
  .threshold-setting input {
    width: 81px;
  }
  .ve-detail-content {
    position: absolute;
    right: 0;
    left: 0;
    top: 4rem;
  }

  .axis-title {
    background-color: rgb(13, 110, 253);
  }
}
</style>