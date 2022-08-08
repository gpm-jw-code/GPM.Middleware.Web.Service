<template>
  <el-drawer v-model="ShowDrawer" direction="btt" size="50%" :title="SensorIP" @close="CloseHandle">
    <GPMChartVue
      ref="Raw_Data_Chart"
      class="h-100"
      chart_id="raw_data_chart"
      :title="SensorIP"
      :key="SensorIP"
      yAxisLabel="G"
    ></GPMChartVue>
  </el-drawer>
</template>
<script>
import GPMChartVue from '@/components/Charting/GPMChart.vue'
import { configs } from '@/config';
import moment from 'moment'
export default {
  components: {
    GPMChartVue,
  },
  data() {
    return {
      ShowDrawer: false,
      SensorIP: "",
      ws: null,
      mockTimer: null,
    }
  },
  methods: {
    CloseHandle() {
      console.info('drawer close');

      try {
        clearInterval(this.mockTimer);
        this.ws.close();
      } catch (error) {
        console.info('drawer close', error);

      }
    },
    ShowRaw(sensor_ip) {

      this.SensorIP = sensor_ip;
      this.WebsocketConnect();
      this.ShowDrawer = true;
    },
    WebsocketConnect() {
      this.ws = new WebSocket(`${configs.idms_websocket_host}/RawData?IP=${this.SensorIP}`);
      this.ws.onmessage = (evt) => this.DataHandle(evt.data);
      this.ws.onclose = () => this.MockFetchFakeData();

    },
    DataHandle(ws_data) {
      var viewModel = JSON.parse(ws_data);
      this.$refs.Raw_Data_Chart.UpdateChart(viewModel);
    },
    MockFetchFakeData() {
      console.info(process.env.NODE_ENV);
      if (process.env.NODE_ENV == 'production')
        return;
      console.info('ws conneect fail use fake data');
      this.mockTimer = setInterval(() => {
        let time = Date.now();
        var xls = [];
        var yls = [];
        var zls = [];
        var labels = [];

        for (let index = 0; index < 512; index++) {
          labels.push(moment(time).add(10 * index, 'milliseconds'));
          xls.push(0.1 + (Math.random() / 2.3));
          yls.push(0.1 + (Math.random() / 1.3));
          zls.push(1.1 + (Math.random() / 2.3));
        }
        var chartViewModel = {
          labels: labels,
          datasets: [
            {
              data: xls,
              label: 'X',
              borderColor: 'blue',
              borderWidth: 1,
              pointRadius: 0
            }, {
              data: yls,
              label: 'Y',
              borderColor: 'green',
              borderWidth: 1,
              pointRadius: 0
            }, {
              data: zls,
              label: 'Z',
              borderColor: 'red',
              borderWidth: 1,
              pointRadius: 0
            }
          ]
        }
        this.DataHandle(JSON.stringify(chartViewModel));
      }, 1000);
    }
  }
}
</script>

<style>
</style>