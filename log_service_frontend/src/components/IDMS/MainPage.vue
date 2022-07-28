<template>
  <div>
    <h1>IDMS</h1>
    <div class="d-flex px-3">
      <el-radio-group v-model="display_mode">
        <el-radio-button label="LIST"></el-radio-button>
        <el-radio-button label="CHART"></el-radio-button>
      </el-radio-group>
    </div>
    <el-divider></el-divider>
    <DignoseDataListView v-show="display_mode=='LIST'"></DignoseDataListView>
    <DignoseDataChartView :pause="display_mode!='CHART'" v-show="display_mode=='CHART'">??</DignoseDataChartView>
  </div>
</template>

<script>
import DignoseDataListView from './components/DignoseDataListView.vue';
import DignoseDataChartView from './components/DignoseDataChartView.vue';
export default {
  data() {
    return {
      display_mode: 'LIST'
    }
  },
  components: {
    DignoseDataListView, DignoseDataChartView
  },
}
</script>

<style  scoped>
</style>