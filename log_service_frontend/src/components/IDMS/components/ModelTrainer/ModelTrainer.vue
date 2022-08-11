<template>
  <el-drawer v-model="Show" direction="rtl" size="60%" title="Model Training">
    <!-- Information? -->

    <!-- Main-Content -->
    <div class="d-flex flex-column">
      <div class="training-content flex-fill d-flex flex-column justify-content-start">
        <div class="step-content justify-content-start">
          <h5>選擇模組</h5>
          <!-- <IDMSModuleSelectVue @changed="ModuleChangeHandle"></IDMSModuleSelectVue> -->
          <div
            style="height:220px; overflow-y: scroll; margin-left:0 "
            class="d-flex flex-column justify-content-start border px-2"
          >
            <el-checkbox-group v-model="IPList" @change="SensorSelectsChanged">
              <div
                class="d-flex flex-column justify-content-start"
                v-for="i in [78,79,81,82]"
                :key="i"
              >
                <el-checkbox :label="'192.168.0.'+i"></el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>

        <div class="step-content d-flex flex-column justify-content-start">
          <h5>命名模型</h5>
          <el-input autocomplete="on" placeholder="模型名稱" v-model="ModelName"></el-input>
        </div>

        <div class="step-content d-flex flex-column justify-content-start">
          <h5>設定錄製時間</h5>
          <el-input-number min="5" v-model="RecordPeriod" class="w-100"></el-input-number>
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
        <el-table :data="TrainStates">
          <el-table-column label="IP" prop="IP"></el-table-column>
          <el-table-column label="請求模型名稱" prop="ModelName"></el-table-column>
          <el-table-column label="狀態" prop="State"></el-table-column>
          <el-table-column label="錄製時間" prop="RecordPeriod"></el-table-column>
          <el-table-column label="Remain Time" prop="RemainTime"></el-table-column>
          <el-table-column label="Message" prop="Message"></el-table-column>
        </el-table>
      </div>
    </div>
  </el-drawer>
</template>

<script>
// import IDMSModuleSelectVue from '../IDMSModuleSelect.vue'
import { configs } from '@/config';
export default {
  data() {
    return {
      Show: false,
      IPList: [],
      ModelName: '',
      RecordPeriod: 10,
      websocket: null,
      TrainStates: [],
      edgeIP: '',
    }
  },
  components: {
    // IDMSModuleSelectVue,
  },
  computed: {
    Start_Enable() {
      return this.IPList.length !== 0 && this.ModelName !== '' && this.RecordPeriod !== 0;
    },
    TrainingReqObj() {
      return {
        IPList: this.IPList,
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
      console.info('Show!!');
      this.edgeIP = edge_ip
      this.WebsocketConnect();
      this.Show = true;
    },
    WebsocketConnect() {
      this.websocket = new WebSocket(`ws://${this.edgeIP}:44332/Model_Training`);
      this.websocket.onopen = () => {
        this.$toast.info('Connected');
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
      this.websocket.send("ModuleUpdate-" + JSON.stringify(this.IPList));
    },
    SendTrainingRequest() {
      this.websocket.send(JSON.stringify(this.TrainingReqObj));
      this.$toast.info('模型訓練請求已送出!');
    },
    TrainingStatusHandle(status) {
      this.TrainStates = status.trainStates;
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
</style>