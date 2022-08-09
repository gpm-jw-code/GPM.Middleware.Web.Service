<template>
  <div style="padding-top:75px">
    <div class="d-flex flex-row px-2 py-2 w-100">
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

    <el-divider></el-divider>
    <DignoseDataListView v-show="display_mode=='LIST'"></DignoseDataListView>
    <DignoseDataChartView :pause="display_mode=='LIST'" v-show="display_mode=='CHART'">??</DignoseDataChartView>
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
      display_mode: 'LIST'
    }
  },
  components: {
    DignoseDataListView, DignoseDataChartView, ModelTrainerVue
  },
  methods: {
    Test() {
      this.$refs.modelTrainer.ShowUp();
    }
  },
}


</script>
<style  scoped>
</style>