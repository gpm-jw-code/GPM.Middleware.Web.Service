<template>
  <el-drawer @closed="CloseHandle" v-model="Show" direction="rtl" size="60%" title="Model Training">
    <!-- Information? -->

    <!-- Main-Content -->
    <div class="d-flex flex-column">
      <div class="training-content flex-fill d-flex flex-column justify-content-start">
        <div class="step-content justify-content-start">
          <h5>選擇模組</h5>
          <!-- <IDMSModuleSelectVue @changed="ModuleChangeHandle"></IDMSModuleSelectVue> -->
          <div
            style="height:120px; overflow-y: scroll; margin-left:0 "
            class="d-flex flex-column justify-content-start border px-2"
          >
            <el-checkbox-group
              :disabled="IsIDMSRecording"
              v-model="SelectedIPList"
              @change="SensorSelectsChanged"
            >
              <div class="d-flex flex-column justify-content-start" v-for="ip in IPList" :key="ip">
                <el-checkbox :label="ip"></el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>

        <div class="step-content d-flex flex-column justify-content-start">
          <h5>命名模型</h5>
          <el-input
            :disabled="IsIDMSRecording"
            autocomplete="on"
            placeholder="模型名稱"
            v-model="ModelName"
          ></el-input>
        </div>

        <div class="step-content d-flex flex-column justify-content-start">
          <h5>設定錄製時間</h5>
          <el-input-number :disabled="IsIDMSRecording" min="5" v-model="RecordPeriod" class="w-100"></el-input-number>
        </div>

        <el-divider></el-divider>
        <div class="step-content-end d-flex flex-column justify-content-start">
          <b-button
            style="height:4rem"
            variant="primary"
            :disabled="!Start_Enable"
            @click="SendTrainingRequest"
          >START</b-button>
        </div>
      </div>
      <div>
        <el-table :data="TrainStates" height="180px">
          <el-table-column label="IP" prop="IP"></el-table-column>
          <el-table-column label="請求模型名稱" prop="ModelName"></el-table-column>
          <el-table-column label="狀態" prop="State"></el-table-column>
          <el-table-column label="錄製時間" prop="RecordPeriod"></el-table-column>
          <el-table-column label="Remain Time" prop="RemainTime"></el-table-column>
          <el-table-column label="Message" prop="Message"></el-table-column>
        </el-table>
      </div>
      <div class="step-content d-flex flex-column justify-content-start">
        <h5>訓練模組狀態</h5>
        <div class="recorder d-flex flex-row justify-content-start">
          <div class="d-flex flex-column">
            <span>狀態</span>
            <el-button
              effect="dark"
              :type="IsIDMSRecording?'danger':'info'"
              size="normal"
            >{{IsIDMSRecording?'訓練中':'IDLE'}}</el-button>
          </div>
          <div class="d-flex flex-column">
            <span>時間設定</span>
            <div class="duration-setting">{{IDMSRecordPeriod}} 秒</div>
          </div>
          <div class="d-flex flex-column">
            <span>累計時間</span>
            <div class="count-down px-3 py-0">{{CountDown}}</div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
// import IDMSModuleSelectVue from '../IDMSModuleSelect.vue'
import { configs } from '@/config';
import { GetModuleInfos } from '@/APIHelpers/IDMSAPIs.js'
export default {
  data() {
    return {
      Show: false,
      IPList: [],
      SelectedIPList: [],
      ModelName: '',
      RecordPeriod: 10,
      websocket: null,
      TrainStates: [],
      edgeIP: '',
      IsIDMSRecording: false,
      CountDown: '00:00:00',
      IDMSRecordPeriod: 10,

    }
  },
  components: {
    // IDMSModuleSelectVue,
  },
  computed: {
    Start_Enable() {
      return !this.IsIDMSRecording && this.SelectedIPList.length !== 0 && this.ModelName !== '' && this.RecordPeriod !== 0;
    },
    TrainingReqObj() {
      return {
        IPList: this.SelectedIPList,
        ModelName: this.ModelName,
        RecordPeriod: this.RecordPeriod
      }
    }
  },
  methods: {
    ModuleChangeHandle(v) {
      console.info('hi', v)
    },
    ShowUp(edge_ip) {
      this.Show = true;
      setTimeout(async () => {
        this.IPList = [];
        let infos = await GetModuleInfos(edge_ip);
        infos.forEach(info => {
          this.IPList.push(info.IP);
        })
        this.edgeIP = edge_ip
        this.WebsocketConnect();

      }, 100)
    },
    CloseHandle() {
      if (this.websocket != null) {
        this.websocket.close();
      }
    },
    WebsocketConnect() {
      this.websocket = new WebSocket(`ws://${this.edgeIP}:44332/Model_Training`);
      this.websocket.onopen = () => {
        this.$toast.info('Connected');
        this.websocket.send("ModuleUpdate-" + JSON.stringify(this.SelectedIPList));

      };
      this.websocket.onmessage = (ent) => this.TrainingStatusHandle(JSON.parse(ent.data));
      this.websocket.onerror = (er) => {
        console.error(er);
        this.$toast.error('發生了一些錯誤(連線異常)', {
          duration: 2500,
          position: 'top'
        });
      };
    },
    SensorSelectsChanged() {
      this.websocket.send("ModuleUpdate-" + JSON.stringify(this.SelectedIPList));
    },
    SendTrainingRequest() {
      this.websocket.send(JSON.stringify(this.TrainingReqObj));
      this.$toast.info('模型訓練請求已送出!');
    },
    TrainingStatusHandle(status) {
      this.IsIDMSRecording = status.isRecoding;
      this.TrainStates = status.trainStates;
      this.CountDown = status.recorderCountDownText;
      this.IDMSRecordPeriod = status.RecordPeriod;
    }

  },
  mounted() {
  },
  beforeMount() {
    if (this.websocket != null) {
      this.websocket.close();
    }
  }
}
</script>

<style>
.step-content h5 {
  text-align: left;
  font-weight: bold;
}
.step-content {
  margin-top: 22px;
}

.recorder {
  font-size: 30px;
}
.recorder span {
  font-size: 20px;
  text-decoration: underline;
  letter-spacing: 2px;
  font-weight: bold;
}
.recorder .el-button {
  margin-top: 7px;
  padding: 10px;
}
.recorder .el-button,
.count-down,
.duration-setting {
  margin-left: 10px;
}

.recorder .count-down {
  background-color: rgb(0, 64, 64);
  color: rgb(0, 192, 0);
  border-radius: 8px;
}
</style>