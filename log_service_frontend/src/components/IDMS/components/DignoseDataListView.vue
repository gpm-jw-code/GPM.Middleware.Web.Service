<template>
  <div class="dignose-list-view px-2">
    <!-- 表格 -->
    <el-table
      :default-sort="{ prop: 'IP', order: 'descending' }"
      height="360"
      :data="DignoseDatas"
      v-loading="loading"
      @row-click="TableRowClickHandle"
      :row-class-name="tableRowClassName"
    >
      <el-table-column sortable prop="IP" label="IP"></el-table-column>
      <el-table-column sortable prop="EqName" label="EQ Name"></el-table-column>
      <el-table-column sortable prop="UnitName" label="Unit Name"></el-table-column>
      <el-table-column sortable prop="HealthScore" label="Health Score"></el-table-column>
      <el-table-column sortable prop="AlertIndex" label="Alert Index"></el-table-column>
    </el-table>

    <!-- 底部圖表區域 -->
    <div class="share-chart-container">
      <!-- <h4>Share use chart there</h4> -->
      <div class="row">
        <div class="col-lg-1">
          <div class="d-flex type-button-container">
            <div class="py-1 bt-container">
              <b-button
                size="sm"
                class="w-100"
                @click="chart_display_mode='health'"
                :variant=" chart_display_mode=='health'?'primary' :'light'"
              >健康分數</b-button>
            </div>
            <div class="py-1 bt-container">
              <b-button
                size="sm"
                class="w-100"
                @click="chart_display_mode='alert_index_day'"
                :variant=" chart_display_mode=='alert_index_day'?'primary' :'light'"
              >劣化指標(天)</b-button>
            </div>
            <div class="py-1 bt-container">
              <b-button
                size="sm"
                class="w-100"
                @click="chart_display_mode='alert_index_hour'"
                :variant=" chart_display_mode=='alert_index_hour'?'primary' :'light'"
              >劣化指標(小時)</b-button>
            </div>
          </div>
        </div>
        <div class="col-lg-11" v-loading="chart_loading">
          <GPMChartVue
            class="share-chart"
            id="share-chart"
            :key="selectedDiagnoseData.IP+chart_display_mode"
            :title="ChartTitle"
            ref="trendChart"
          ></GPMChartVue>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GPMChartVue from '@/components/Charting/GPMChart.vue';
import { configs } from '@/config';

export default {
  components: {
    GPMChartVue,
  },
  data() {
    return {
      ws: {
        type: WebSocket
      },
      trendchart_ws: null,
      loading: true,
      chart_loading: false,
      DignoseDatas: [],
      chart_display_mode: 'health',
      selectedDiagnoseData: { IP: '???' },
      renderingDiagnoseData: [],
      tableRowClassName: "TEST"
    }
  },
  methods: {
    TableRowClickHandle(row) {
      if (this.selectedDiagnoseData.IP != row.IP) {

        this.chart_loading = true;
        console.info('to create ws', row.IP);
        this.RTChartWebsocketIni(row.IP);
      }

      this.selectedDiagnoseData = row;

    },
    RTChartWebsocketIni(ip) {
      if (!ip)
        return;
      if (this.trendchart_ws)
        this.trendchart_ws.close();
      this.trendchart_ws = new WebSocket(`${configs.idms_websocket_host}/Dignose?type=chart&number=180&ip=${ip}`);
      this.trendchart_ws.onopen = () => {
        setTimeout(() => {
          this.chart_loading = false;
        }, 200);
        console.info('ws opened')
      }
      this.trendchart_ws.onclose = () => { console.info('ws clsoed') }
      this.trendchart_ws.onmessage = (ws) => {
        var data = JSON.parse(ws.data);
        this.RenderTrendChart(data);

      }
    },
    RenderTrendChart(data) {
      this.renderingDiagnoseData = data[0];
      var _chartData;
      var timeList = [];
      var datasets = [];
      var borderColor = 'gold';

      if (this.chart_display_mode == 'health') {
        _chartData = this.renderingDiagnoseData.chartDatas.healthScoreList;
        borderColor = 'rgb(21, 237, 201)';
      }

      if (this.chart_display_mode == 'alert_index_hour')
        _chartData = this.renderingDiagnoseData.chartDatas.alertIndex_by_Hour_List;

      if (this.chart_display_mode == 'alert_index_day')
        _chartData = this.renderingDiagnoseData.chartDatas.alertIndex_by_Day_List;

      if (_chartData.length == 0) {
        return;
      }

      timeList = Object.keys(_chartData);
      var scoreList = Object.values(_chartData);
      datasets.push({
        label: "Health Score",
        data: scoreList,
        borderColor: borderColor
      });
      if (this.$refs.trendChart)
        this.$refs.trendChart.Update(timeList, datasets);
    }
  },
  computed: {
    ChartTitle() {
      if (!this.selectedDiagnoseData.EqName)
        return "點選表格以顯示趨勢圖表";
      return `${this.DisplayModeName}: ${this.selectedDiagnoseData.EqName}-${this.selectedDiagnoseData.UnitName} (${this.selectedDiagnoseData.IP})`;
    },
    DisplayModeName() {
      if (this.chart_display_mode == 'health')
        return "健康分數趨勢"
      if (this.chart_display_mode == 'alert_index_hour')
        return "劣化指標(小時)"
      if (this.chart_display_mode == 'alert_index_day')
        return "劣化指標(天)"
      return "";
    }

  },

  mounted() {
    this.ws = new WebSocket("ws://192.168.0.102:44332/Dignose?type=list");
    this.ws.onopen = () => { }
    this.ws.onmessage = (_ws) => {
      this.loading = false;
      this.DignoseDatas = JSON.parse(_ws.data);
    }
  },
  unmounted() {
    this.ws.close();
  }
}
</script>

<style>
.share-chart-container {
  background-color: #313131;
  color: gold;
  height: 320px;
  position: absolute;
  width: 99%;
  bottom: 0;
  margin: 10px;
  padding: 10px 20px;
  border-radius: 8px;
}
.share-chart {
  height: 280px;
  margin: 20px;
}

.type-button-container {
  flex-direction: column;
}

@media screen and (max-width: 991px) {
  .share-chart-container {
    height: 360px;
  }
  .type-button-container {
    flex-direction: row;
  }
  .type-button-container .bt-container {
    margin-right: 5px;
  }
}

.TEST {
  background-color: "red";
}
</style>