<template>
  <div class="dignose-list-view px-2">
    <!-- 表格 -->
    <el-table
      stripe
      :default-sort="{ prop: 'IP', order: 'descending' }"
      height="360"
      :data="DignoseDatas"
      v-loading="loading"
      @row-click="TableRowClickHandle"
      :row-class-name="tableRowClassName"
      row-key="IP"
    >
      <el-table-column width="30">
        <template #default="scope">
          <div class="py-1">
            <el-icon
              :size="20"
              color="rgb(64, 158, 255)"
              v-show="scope.row.IP==selectedDiagnoseData.IP"
            >
              <CaretRight />
            </el-icon>
          </div>
        </template>
      </el-table-column>

      <el-table-column sortable prop="IP" label="IP"></el-table-column>
      <el-table-column sortable prop="EqName" label="EQ Name"></el-table-column>
      <el-table-column sortable prop="UnitName" label="Unit Name"></el-table-column>
      <el-table-column sortable prop="HealthScore" label="Health Score"></el-table-column>
      <el-table-column sortable prop="AlertIndex" label="Alert Index"></el-table-column>
      <el-table-column sortable label="模組狀態">
        <template #default="scope">
          <el-tag
            effect="dark"
            size="large"
            style="width:100px"
            :type="scope.row.ModuleAbnormal? 'danger':'success'"
          >{{scope.row.ModuleAbnormal?'異常':'正常'}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column type="expand">
        <template #default="props">
          <div class="dignose-detail-info">
            <div class="d-flex">
              <div class="item-name">是否超出SPC</div>
              <div>{{props.row.DignoseDetailData.isOutoutSPC}}</div>
            </div>
            <div class="d-flex">
              <div class="item-name">當前模型</div>
              <div>{{props.row.DignoseDetailData.currentModelName}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部圖表區域 -->
    <div class="share-chart-container" v-loading="loading">
      <!-- <h4>Share use chart there</h4> -->
      <div class="row">
        <div class="col-lg-1">
          <div class="d-flex type-button-container">
            <div class="py-1 bt-container" v-for="mode in display_modes" :key="mode.value">
              <b-button
                size="sm"
                class="w-100"
                @click="chart_display_mode=mode.value"
                :variant=" chart_display_mode==mode.value?'primary' :'light'"
              >{{mode.label}}</b-button>
            </div>
          </div>
        </div>
        <div
          class="col-lg-11"
          v-loading="chart_loading"
          element-loading-background="rgba(122, 122, 122, 0.8)"
        >
          <GPMChartVue
            class="share-chart"
            chart_id="share-chart"
            :key="selectedDiagnoseData.IP+chart_display_mode"
            :title="ChartTitle"
            :yAxisLabel="ylabel"
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
import { GenDiagnoseChartData, display_modes } from '../Helpers';

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
      display_modes: display_modes,
      DignoseDatas: [],
      chart_display_mode: 'HS',
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
      if (this.trendchart_ws)
        this.trendchart_ws.close();

      this.trendchart_ws = new WebSocket(`${configs.idms_websocket_host}/Dignose?type=chart&number=90&ip=${ip}`);
      this.trendchart_ws.onopen = () => {
        setTimeout(() => {
          this.chart_loading = false;
        }, 200);
        console.info('ws opened')
      }
      this.trendchart_ws.onclose = () => { console.info('ws clsoed') }
      this.trendchart_ws.onmessage = (evt) => {
        var data = JSON.parse(evt.data);
        this.RenderTrendChart(data[0]);

      }
    },
    RenderTrendChart(data) {

      try {
        this.renderingDiagnoseData = data;
        var chartingObj = GenDiagnoseChartData(data, this.chart_display_mode);
        if (this.$refs.trendChart)
          var ret = this.$refs.trendChart.UpdateChart(chartingObj.timeLs, chartingObj.datasets);
        if (ret == "err") {
          this.RTChartWebsocketIni(this.selectedDiagnoseData.IP);
        }
      } catch (error) {
        console.info(error)
      }

    }
  },
  computed: {
    ChartTitle() {
      if (!this.selectedDiagnoseData.EqName)
        return "點選表格以顯示趨勢圖表";
      return `${this.DisplayModeName}: ${this.selectedDiagnoseData.EqName}-${this.selectedDiagnoseData.UnitName} (${this.selectedDiagnoseData.IP})`;
    },
    DisplayModeName() {
      if (this.chart_display_mode == 'HS')
        return "健康分數趨勢"
      if (this.chart_display_mode == 'AID')
        return "劣化指標(小時)"
      if (this.chart_display_mode == 'AIH')
        return "劣化指標(天)"
      return "";
    },
    ylabel() {
      if (this.chart_display_mode == 'HS')
        return 'Score';
      if (this.chart_display_mode == 'AID' | this.chart_display_mode == 'AIH')
        return 'Index';
      return "";

    }

  },

  mounted() {
    this.ws = new WebSocket(`${configs.idms_websocket_host}/Dignose?type=list`);
    this.ws.onopen = () => { }
    this.ws.onmessage = (ws) => {
      this.loading = false;
      this.DignoseDatas = JSON.parse(ws.data);

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
  width: 100%;
  bottom: 0;
  /* margin: 10px; */
  /* box-shadow: 12px 2px 32px 10px black; */
  padding: 10px 20px;
  border-radius: 8px;
  border: black 1px solid;
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

.dignose-detail-info {
}

.dignose-detail-info .item-name {
  width: 100px;
}
</style>