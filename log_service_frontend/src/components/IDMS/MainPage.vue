<template>
  <div class="fade-in">
    <div class="d-flex flex-row px-2 py-2 my-2 w-100 border-bottom">
      <div class="d-flex justify-content-start flex-fill w-50">
        <el-radio-group v-model="display_mode">
          <el-radio-button size="small" label="LIST"></el-radio-button>
          <el-radio-button size="small" label="CHART"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="d-flex justify-content-end w-50">
        <el-button @click="Test" size="small">模型訓練</el-button>
      </div>
    </div>

    <DignoseDataListView :edgeIP="EdgeIP" v-show="display_mode=='LIST'"></DignoseDataListView>
    <DignoseDataChartView
      :edgeIP="EdgeIP"
      :pause="display_mode=='LIST'"
      v-show="display_mode=='CHART'"
    >??</DignoseDataChartView>
    <ModelTrainerVue ref="modelTrainer"></ModelTrainerVue>
  </div>
</template>

<script>
import ModelTrainerVue from './components/ModelTrainer/ModelTrainer.vue';
import DignoseDataListView from './components/DignoseDataListView.vue';
import DignoseDataChartView from './components/DignoseDataChartView.vue';
export default {
  data() {
    return {
      display_mode: 'LIST',
      EdgeIP: "127.0.0.1"
    }
  },
  components: {
    DignoseDataListView, DignoseDataChartView, ModelTrainerVue
  },
  methods: {
    Test() {
      this.$refs.modelTrainer.ShowUp(this.EdgeIP);
    }
  },
  mounted() {
  },
  created() {
    console.info('fff', this.$route.params.ip)
    this.EdgeIP = this.$route.params.ip;
    localStorage.setItem('edgeip', this.EdgeIP);
  }
}


</script>
<style  scoped>
</style>