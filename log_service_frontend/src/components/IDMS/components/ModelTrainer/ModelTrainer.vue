<template>
  <el-drawer v-model="Show" direction="rtl" size="50%" title="Model Training">
    <div class="d-flex flex-column" style="height:40%">
      <div class="training-content flex-fill d-flex flex-column justify-content-start">
        <div class="step-content justify-content-start">
          <h5>選擇模組</h5>
          <!-- <IDMSModuleSelectVue @changed="ModuleChangeHandle"></IDMSModuleSelectVue> -->
          <div
            style="height:220px; overflow-y: scroll; margin-left:0 "
            class="bg-info d-flex flex-column justify-content-start"
          >
            <el-checkbox-group v-model="IPList">
              <div
                class="bg-info d-flex flex-column justify-content-start"
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
          <el-input v-model="ModelName"></el-input>
        </div>

        <div class="step-content d-flex flex-column justify-content-start">
          <h5>設定錄製時間</h5>
          <el-input-number min="5" v-model="RecordPeriod" class="w-100"></el-input-number>
        </div>

        <el-divider></el-divider>
        <div class="step-content-end d-flex flex-column justify-content-start">
          <b-button variant="primary" :disabled="!Start_Enable" @click="SendTrainingRequest">START</b-button>
        </div>
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
      Show: true,
      IPList: [],
      ModelName: '',
      RecordPeriod: 10,
      websocket: null
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
    ShowUp() {
      console.info('Show!!');
      this.Show = true;
    },
    SendTrainingRequest() {
      this.websocket = new WebSocket(`${configs.idms_websocket_host}/Model_Training`);
      this.websocket.onopen = () => {
        this.websocket.send(JSON.stringify(this.TrainingReqObj));
      }
      this.websocket.onmessage = (ent) => this.TrainingStatusHandle(JSON.parse(ent.data));
    },
    TrainingStatusHandle(status) {

    }

  }
}
</script>

<style>
.step-content h5 {
  text-align: left;
}
.step-content {
  margin-top: 22px;
}
</style>