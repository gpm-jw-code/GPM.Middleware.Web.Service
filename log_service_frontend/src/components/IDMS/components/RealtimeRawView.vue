<template>
  <div class="raw-view">
    <el-drawer v-model="ShowUp" direction="btt" size="50%">
      <div class="h-100">
        <GPMChartVue class="h-100" chart_id="raw-data-chart" title="Raw Data"></GPMChartVue>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import GPMChartVue from '@/components/Charting/GPMChart.vue';
export default {
  components: {
    GPMChartVue,
  },
  data() {
    return {
      ShowUp: false,
      SensorIP: ""
    }
  },
  props: {
  },
  methods: {
    Show(ip) {
      this.SensorIP = ip;
      this.ShowUp = true;
    },

  },
}
</script>

<style>
.raw-view {
  z-index: 35002;
}
</style>