<template>
  <div style="padding-top:75px">
    <div class="d-flex px-2 py-2">
      <el-radio-group v-model="display_mode">
        <el-radio-button size="small" label="LIST"></el-radio-button>
        <el-radio-button size="small" label="CHART"></el-radio-button>
      </el-radio-group>
    </div>
    <el-divider></el-divider>
    <DignoseDataListView v-show="display_mode=='LIST'"></DignoseDataListView>
    <DignoseDataChartView v-show="display_mode=='CHART'">??</DignoseDataChartView>
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