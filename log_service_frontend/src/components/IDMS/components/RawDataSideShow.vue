<template>
  <el-drawer v-model="ShowDrawer" direction="btt" size="70%" :title="Title" @close="CloseHandle">
    <div class="message d-flex flex-row w-100 px-1 mx-0 my-0 bg-light border-bottom">
      <el-tag effect="dark" :type="connected?'success':'danger'">{{connected?'已連線':'已斷線'}}</el-tag>
      <div style="width:340px">
        <el-select class="w-100" size="small" v-model="SensorIP" @change="ChangeIPHandle">
          <el-option
            v-for="module in ExistModuleList"
            :key="module.IP"
            :value="module.IP"
            :label="`${module.EqName}-${module.UnitName}(${module.IP})`"
          ></el-option>
        </el-select>
      </div>
      <div class="flex-fill d-flex flex-row justify-content-end">
        <b-button v-if="!pause" size="sm" pill @click="pause=true">暫停</b-button>
        <b-button v-else size="sm" pill class="bg-success" @click="pause=false">繼續</b-button>
      </div>
    </div>
    <div class="row g-0 h-100 w-100 mx-0 my-0 pb-5">
      <div class="col-md-6 h-100">
        <span class="raw-data-viewer">
          <el-icon>
            <TrendCharts />
          </el-icon>G Value
        </span>
        <GPMChartVue
          ref="Raw_Data_Chart"
          class="h-100"
          chart_id="raw_data_chart-1"
          :title="Title"
          :key="SensorIP"
          yAxisLabel="G"
          v-loading="!data_in"
          :xlabelUseTimeFormat="false"
        ></GPMChartVue>
      </div>
      <div class="col-md-6 h-100">
        <span class="raw-data-viewer">
          <el-icon>
            <TrendCharts />
          </el-icon>FFT
        </span>
        <GPMChartVue
          ref="Raw_Data_Chart_FFT"
          class="h-100"
          chart_id="raw_data_chart-fft"
          :title="Title"
          :key="SensorIP"
          yAxisLabel="Mag"
          xAxisLabel="Freq(Hz)"
          v-loading="!data_in"
          :xlabelUseTimeFormat="false"
        ></GPMChartVue>
      </div>
    </div>
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
  props: {
    ExistModuleList: {
      type: Array,
      default() {
        return [
          {
            IP: "",
            EqName: "",
            UnitName: ""
          }
        ]
      }
    }
  },
  data() {
    return {
      ShowDrawer: false,
      SensorIP: "",
      ws: null,
      mockTimer: null,
      connected: false,
      pause: false,
      data_in: false,
      edgeIP: "123.123.213.213"
    }
  },
  methods: {
    ChangeIPHandle() {
      this.data_in = false;
      this.ws.onopen = null;
      this.ws.onclose = null;
      this.ws.onmessage = null;
      this.ws.close();
      this.WebsocketConnect(this.edgeIP);
    },
    CloseHandle() {
      console.info('drawer close');
      this.data_in = false;
      try {
        clearInterval(this.mockTimer);
        this.ws.close();
      } catch (error) {
        console.info('drawer close', error);

      }
    },
    async ShowRaw(edgeIP, sensor_ip) {
      this.edgeIP = edgeIP;
      this.SensorIP = sensor_ip;
      this.ShowDrawer = true;
      while (! await this.WebsocketConnect(edgeIP)) {
        setTimeout(() => {

        }, 100);
      }

    },
    async WebsocketConnect(edgeIP) {
      return await new Promise((resolve) => {
        this.ws = new WebSocket(`ws://${edgeIP}:44332/RawG?IP=${this.SensorIP}`);
        this.ws.onopen = () => {
          this.connected = true;
          resolve(true)
        };
        this.ws.onmessage = (evt) => this.DataHandle(evt.data);
        this.ws.onclose = () => {
          this.connected = false;
          resolve(false);
        };
      });

    },
    Reconnect() {

    },
    DataHandle(ws_data) {
      this.data_in = true;
      if (this.pause)
        return;
      if (ws_data) {
        var viewModels = JSON.parse(ws_data);
        // viewModel.datasets[0].pointRadius = 3;

        if (this.$refs.Raw_Data_Chart)
          this.$refs.Raw_Data_Chart.UpdateChart(viewModels[0], 'second');
        this.$refs.Raw_Data_Chart_FFT.UpdateChart(viewModels[1]);
      }
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
  },
  computed: {
    HOST() {
      return configs.idms_websocket_host + "/RawG"
    },
    Title() {
      if (this.ExistModuleList.length == 0)
        return "REAL-TIME DATA";
      var module = this.ExistModuleList.find(mo => mo.IP == this.SensorIP);
      if (module) {
        return `REAL-TIME DATA OF ${module.EqName}-${module.UnitName}(${module.IP})`;
      } else
        return "REAL-TIME DATA";
    }
  }
}
</script>

<style>
.raw-data-viewer {
  font-size: 2.5vmin;
}
.raw-data-viewer el-icon {
  background-color: white;
}
</style>