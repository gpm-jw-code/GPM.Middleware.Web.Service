<template>
  <tr class="module-state-tr">
    <th v-b-toggle="toggleID">
      <div>{{moduleInfo.index}}</div>
    </th>
    <!--IP-->
    <td v-b-toggle="toggleID">
      <div class="pt-2">{{moduleInfo.ip}}</div>
    </td>
    <!--Port-->
    <td v-b-toggle="toggleID">
      <div class="pt-2">{{moduleInfo.port}}</div>
    </td>

    <!--量測範圍-->
    <td>
      <div v-if="gRangeSetting | SensingData.measureRange==''" class="spinner-border" role="status">
        <span class="visually-hidden"></span>
      </div>
      <transition name="el-zoom-in-bottom">
        <div v-show="!(gRangeSetting | SensingData.measureRange=='')" class="dropdown">
          <b-button
            class="dropdown-toggle measure-range-button"
            variant="dark"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            size="md"
          >{{SensingData.measureRange}}</b-button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li v-for="g in [2,4,8,16] " :key="g">
              <u class="dropdown-item" @click="ModifyGRange(g)">{{g}}G</u>
            </li>
          </ul>
        </div>
      </transition>
    </td>

    <!--更新時間-->
    <td v-b-toggle="toggleID">
      <div v-show="SensingData.RecieveTime==''" class="spinner-border" role="status">
        <span class="visually-hidden"></span>
      </div>
      <transition name="el-zoom-in-bottom">
        <div v-show="SensingData.RecieveTime!=''" class="pt-2">{{DataUpdateTime}}</div>
      </transition>
    </td>

    <!--狀態-->
    <td v-b-toggle="toggleID" style="text-align:center">
      <div v-show="SensingData.ErrorCode==-1" class="spinner-border" role="status">
        <span class="visually-hidden"></span>
      </div>
      <transition name="el-zoom-in-bottom">
        <div
          v-show="SensingData.ErrorCode!=-1"
          class="connection-label"
          v-bind:style="{ backgroundColor: SensingData.ErrorCode==0?'seagreen':'red'}"
        >{{ SensingData.ErrorCode==0? 'CONNECTED':SensingData.ErrorCode }}</div>
      </transition>
    </td>

    <!--操作-->
    <td class="opt-region-div">
      <b-button size="sm" variant="light" squared v-b-toggle="toggleID">More</b-button>
    </td>
    <td class="opt-region-div">
      <b-button size="sm" variant="danger" squared @click="RemoveBtnClickHandle(moduleInfo)">Remove</b-button>
    </td>
  </tr>

  <tr>
    <td colspan="8">
      <b-collapse ref="collapse" class="more-info-collapse" :id="toggleID">
        <div>特徵值</div>
        <div class="f-table">
          <table class="table">
            <tr class="columns">
              <th scope="col" class="col-2"></th>
              <th scope="col" class="col-3">X</th>
              <th scope="col" class="col-3">Y</th>
              <th scope="col" class="col-3">Z</th>
            </tr>
            <tbody>
              <tr>
                <td class="f-name">P2P</td>
                <td>{{SensingData.Features.AccP2P.X.toFixed(4)}}</td>
                <td>{{SensingData.Features.AccP2P.Y.toFixed(4)}}</td>
                <td>{{SensingData.Features.AccP2P.Z.toFixed(4)}}</td>
              </tr>
              <tr>
                <td class="f-name">RMS</td>
                <td>{{SensingData.Features.AccRMS.X.toFixed(4)}}</td>
                <td>{{SensingData.Features.AccRMS.Y.toFixed(4)}}</td>
                <td>{{SensingData.Features.AccRMS.Z.toFixed(4)}}</td>
              </tr>
              <tr>
                <td class="f-name">振動能量</td>
                <td>{{SensingData.Features.VibrationEnergy.X.toFixed(4)}}</td>
                <td>{{SensingData.Features.VibrationEnergy.Y.toFixed(4)}}</td>
                <td>{{SensingData.Features.VibrationEnergy.Z.toFixed(4)}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-collapse>
    </td>
  </tr>
</template>

<script setup >
import { RemoveModule } from '@/APIHelpers/BackendAPIs'
import { defineEmits } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
const emits = defineEmits(["OnModuleRemove"])

async function RemoveBtnClickHandle(moduleInfo) {
  ElMessageBox.confirm(`確定要移除 ${moduleInfo.endPoint}?`, 'Warning', {
    confirmButtonText: '確定',
    cancelButtonText: '取消'
  }).then(async () => {

    var res = await RemoveModule(moduleInfo);
    if (res) {
      emits("OnModuleRemove", {});
      ElMessage({ type: 'info', message: `${moduleInfo.endPoint} 刪除成功` })
    }
  })
}
</script>

<script >

import { SetMeasureRange } from '@/APIHelpers/BackendAPIs'
import moment from 'moment';
import clsModuleInfo from '@/Classes/clsModuleInfo.js'
import { configs } from '@/config.js';

export default {

  data() {
    return {
      SensingData: {
        AccData: {
          X: [],
          Y: [],
          Z: [],
        },
        FFTData: {
          X: [],
          Y: [],
          Z: [],
          FreqVec: [],
          Freq_Resolution: 1

        },
        Features: {
          AccP2P: {
            X: -1,
            Y: -1,
            Z: -1,
          },
          AccRMS: {
            X: -1,
            Y: -1,
            Z: -1,

          },
          VibrationEnergy: {
            X: -1,
            Y: -1,
            Z: -1,

          }
        },
        measureRange: '',
        ErrorCode: -1,
        RecieveTime: ''
      },
      ConnectionState: "",
      ShowMore: false,
      gRange: 2,
      gRangeSetting: false
    }
  },
  computed: {
    DataUpdateTime() {
      return moment(this.SensingData.RecieveTime).format('yyyy-MM-DD HH:mm:ss');
    },
    toggleID() {
      return "toggle" + this.moduleInfo.ip.replaceAll('.', '_') + this.moduleInfo.port;
    }
  },
  props: {
    moduleInfo: {
      type: clsModuleInfo,
      default: () => new clsModuleInfo("127.0.0.1", 6969)
    },
  },
  methods: {
    WsSensingDataHandle(data) {
      var json = JSON.parse(data);
      this.SensingData = JSON.parse(json.Message)
    },
    WsConnectStateDataHandle(data) {
      var json = JSON.parse(data);
      this.ConnectionState = json.Message;
    },

    MoreBtnClickHandle() {
      this.ShowMore = !this.ShowMore;
    },
    async ModifyGRange(g) {
      this.gRangeSetting = true;
      var response = await SetMeasureRange(this.moduleInfo.ip, this.moduleInfo.port, g);
      console.info(response);
      if (response.errorCode == 0) {
        this.gRange = g;
      }
      setTimeout(() => {
        this.gRangeSetting = false;
      }, 500);
    }
  },
  mounted() {

    var data_ws = new WebSocket(`${configs.websocket_host}/module_data/${this.moduleInfo.endPoint}`);
    data_ws.onopen = () => { console.info(`${this.moduleInfo.endPoint} data ws 已連接.`) };
    data_ws.onmessage = (_ws) => { this.WsSensingDataHandle(_ws.data) };

    var connectState_ws = new WebSocket(`${configs.websocket_host}/module_state/${this.moduleInfo.endPoint}`);
    connectState_ws.onopen = () => { console.info(`${this.moduleInfo.endPoint} state ws 已連接.`) };
    connectState_ws.onmessage = (_ws) => { this.WsConnectStateDataHandle(_ws.data) };
  },
}
</script>
<style>
.module-state-view {
  /* background-color: #515151;
  color: white;
  margin: 10px;
  border-radius: 5px; */
}

.module-state-view .title {
  background-color: #313131;
  border-start-end-radius: 5px;
  border-start-start-radius: 5px;
  padding: 5px;
  text-align: left;
}

.f-table {
  background-color: #515151;
  color: white;
  margin: auto 240px;
  padding: 0;
}

.f-table table {
  color: white;
}
.f-table table .columns {
  background-color: #111111;
}

.f-table table .f-name {
  background-color: #c2c2c2;
  letter-spacing: 4px;
}
.f-table td {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
.dropdown-menu u:hover {
  cursor: pointer;
}

.connection-label {
  margin: auto 74px;
  padding: 6px;
  font-weight: bold;
  color: white;
  border-radius: 3px;
  font-size: 15px;
}
.module-state-tr {
  font-size: medium;
}
.module-state-tr .dropdown-item {
  width: 58px;
  text-decoration: underline;
  letter-spacing: 3px;
}
.more-info-collapse {
  background-color: #f1f1f1;
  padding: 10px;
}
.measure-range-button {
  width: 120px;
}

@media screen and (max-width: 800px) {
  .opt-region-div {
    visibility: hidden;
  }
}
</style>