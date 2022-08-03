<template>
  <div class="dignose-list-view px-2">
    <div class="d-flex justify-content-end">
      <el-button @click="TableExpandHandle">{{ this.expandAll?'全部收合' :'全部展開'}}</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :default-sort="{ prop: 'EqName', order: 'ascending' }"
      :height="table_height"
      :data="DignoseDatas"
      highlight-current-row
      @row-click="TableRowClickHandle"
      @expand-change="ExpandHandle"
      :row-class-name="tableRowClassName"
      row-key="IP"
      ref="table"
    >
      <el-table-column fixed="'left'" width="40">
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

      <el-table-column sortable fixed="left" prop="IP" label="IP" width="140"></el-table-column>
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
          <div class="dignose-detail-info d-flex">
            <div>
              <div class="d-flex">
                <div class="item-name">當前模型</div>
                <div>{{props.row.DignoseDetailData.currentModelName}}</div>
              </div>
              <div class="d-flex">
                <div class="item-name">Warning Threshold</div>
                <div>
                  <el-input-number
                    :max="100"
                    :min="0"
                    :step="0.1"
                    size="small"
                    v-model="GetTreshodlVal(props.row).warningThreshold"
                    @change="SetWarningThreshold(props.row.IP)"
                  ></el-input-number>
                </div>
              </div>
              <div class="d-flex">
                <div class="item-name">Alarm Threshold</div>
                <div>
                  <el-input-number
                    :max="100"
                    :min="0"
                    :step="0.1"
                    size="small"
                    v-model="GetTreshodlVal(props.row).alarmThreshold"
                    @change="SetAlarmThreshold(props.row.IP)"
                  ></el-input-number>
                </div>
              </div>
              <!-- <div class="d-flex">
                <div class="item-name">是否超出SPC</div>
                <div>{{props.row.DignoseDetailData.isOutoutSPC}}</div>
              </div>-->
            </div>
            <div class="mx-3" d-flex>
              <el-button @click="ShowModelList(props.row.IP)">模型列表</el-button>
              <el-button>事件列表</el-button>
              <el-button>Raw Data</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部圖表區域 -->
    <div class="d-flex" v-bind:class=" ['showing-down-arrow','fixed-in-bottom'] ">
      <b-button
        class="btn-share-chart-show"
        :variant=" share_chart_show? 'light': 'primary' "
        @click="share_chart_show=!share_chart_show"
      >
        <el-icon class="mx-2">
          <ArrowDownBold v-if="share_chart_show"></ArrowDownBold>
          <ArrowUpBold v-else></ArrowUpBold>
        </el-icon>REAL-TIME CHART
      </b-button>
    </div>
    <transition name="el-zoom-in-bottom">
      <div
        v-show="share_chart_show"
        class="share-chart-container fixed-in-bottom"
        v-bind:style="current_share_chart_style"
      >
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
          <div class="col-lg-11" element-loading-background="rgba(122, 122, 122, 0.8)">
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
    </transition>
    <ModelListView ref="modelListView"></ModelListView>
  </div>
</template>

<script>
import GPMChartVue from '@/components/Charting/GPMChart.vue';
import { GenDiagnoseChartData, display_modes, DemoData } from '../Helpers';
import ModelListView from './ModelListView.vue';
import { GetDignoseDataListWsInstance, GetDignoseThresholdVal, GetTrendchartWsInstance, SetDignoseWarningThreshold, SetDignoseAlarmThreshold } from '@/APIHelpers/IDMSAPIs.js';
class clsTresholdSetting {
  warningThreshold = 69;
  alarmThreshold = 87;
}

export default {
  components: {
    GPMChartVue, ModelListView
  },
  data() {
    return {
      ws: {
        type: WebSocket
      },
      share_chart_show: false,
      trendchart_ws: null,
      loading: true,
      chart_loading: false,
      expandAll: false,
      display_modes: display_modes,
      DignoseDatas: [
        { IP: '12.123.123.1', EqName: 'demo1', UnitName: 'Demo1', HealthScore: 99.3, AlertIndex: 0.3, ModuleAbnormal: false, DignoseDetailData: {} },
        { IP: '12.123.123.2', EqName: 'demo1', UnitName: 'Demo2', HealthScore: 9.3, AlertIndex: 0.9, ModuleAbnormal: false, DignoseDetailData: {} },
        { IP: '12.123.123.3', EqName: 'demo1', UnitName: 'Demo3', HealthScore: 9.3, AlertIndex: 0.8, ModuleAbnormal: true, DignoseDetailData: {} }
      ],
      chart_display_mode: 'HS',
      selectedDiagnoseData: { IP: '???' },
      renderingDiagnoseData: [],
      ThresholdSettings: {
        'ip': new clsTresholdSetting()
      },
      current_share_chart_style: {
        backgroundColor: '#313131', border: '1px solid black'
      },
      share_chart_styles: {
        normal: { backgroundColor: '#313131', border: '1px solid black' },
        warning: { backgroundColor: '#e5bc41', border: '1px solid white' },
        danger: { backgroundColor: 'rgb(217, 94, 94)', border: '1px solid white' }
      },


    }
  },
  methods: {
    TableExpandHandle() {
      this.expandAll = !this.expandAll;
      this.DignoseDatas.forEach(row => {
        this.$refs.table.toggleRowExpansion(row, this.expandAll);
      })
    },
    tableRowClassName({ row }) {
      return row.DignoseDetailData.dignoseResult;
    },

    async TableRowClickHandle(row) {
      if (this.selectedDiagnoseData.IP != row.IP) {

        this.chart_loading = true;
        console.info('to create ws', row.IP);
        this.RTChartWebsocketIni(row.IP);
      }
      this.selectedDiagnoseData = row;

      var ret = await GetDignoseThresholdVal(this.selectedDiagnoseData.IP);
      if (ret.success) {
        this.ThresholdSettings[this.selectedDiagnoseData.IP] = ret.data;
      }

    },
    async RTChartWebsocketIni(ip) {
      if (this.trendchart_ws)
        this.trendchart_ws.close();

      this.trendchart_ws = await GetTrendchartWsInstance(ip);
      this.chart_loading = this.trendchart_ws == null;
      if (this.trendchart_ws != null) {

        this.trendchart_ws.onmessage = (evt) => {
          var data = JSON.parse(evt.data);
          this.RenderTrendChart(data[0]);

        }
      } else {
        await this.RTChartWebsocketIni(ip);
      }
    },
    RenderTrendChart(data) {
      try {
        this.renderingDiagnoseData = data;

        //TODO 閥值線物件
        var thresObjs = undefined;

        if (this.chart_display_mode === 'HS') {
          var warnThres = data.DignoseDetailData.WarningThreshold;
          var alarmThres = data.DignoseDetailData.AlarmThreshold;
          thresObjs = [{ name: 'Warning', value: warnThres, color: 'gold' },
          { name: 'alarm', value: alarmThres, color: 'red' }]
        }
        var chartingObj = GenDiagnoseChartData(data, this.chart_display_mode, thresObjs);
        if (this.$refs.trendChart)
          var ret = this.$refs.trendChart.UpdateChart(chartingObj.timeLs, chartingObj.datasets);
        if (ret == "err") {
          this.RTChartWebsocketIni(this.selectedDiagnoseData.IP);
        }

        var dignoseState = data.DignoseDetailData.dignoseResult;
        this.current_share_chart_style = this.share_chart_styles[dignoseState];

      } catch (error) {
        console.info(error)
      }

    },
    GetTreshodlVal(rowData) {
      if (this.ThresholdSettings[rowData.IP] == undefined) {
        return new clsTresholdSetting();
      }
      return this.ThresholdSettings[rowData.IP];
    },
    async ExpandHandle(rowData, rows = []) {
      if (rows.length == 0)
        return;
      var ip = rowData.IP;
      var ret = await GetDignoseThresholdVal(ip);
      if (ret.success) {
        this.ThresholdSettings[ip] = ret.data;
      }
    },
    async SetWarningThreshold(ip) {
      await SetDignoseWarningThreshold(ip, this.ThresholdSettings[ip].warningThreshold);
    },
    async SetAlarmThreshold(ip) {
      await SetDignoseAlarmThreshold(ip, this.ThresholdSettings[ip].alarmThreshold);
    },
    ShowModelList(ip) {
      this.$refs.modelListView.UpdateModuleInfos();
      this.$refs.modelListView.ShowModelList(ip);
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

    },
    table_height() {
      console.info(window.innerHeight);
      return this.share_chart_show ? window.innerHeight * 0.35 : window.innerHeight - 220;
    }

  },

  async mounted() {
    setInterval(() => {
      console.log('demo');
      var chartingObj = DemoData();
      this.$refs.trendChart.UpdateChart(chartingObj.timeLs, chartingObj.datasets);

    }, 1000);

    this.ws = await GetDignoseDataListWsInstance();
    console.info('s', this.ws);
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
.fixed-in-bottom {
  position: fixed;
  width: 99%;
  bottom: 0;
}
.share-chart-container {
  background-color: #313131;
  color: gold;
  height: 320px;
  /* margin: 10px; */
  /* box-shadow: 12px 2px 32px 10px black; */
  padding: 10px 20px;
  border-radius: 8px;
  border: black 1px solid;
  z-index: 5000;
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

.el-table .warning,
.el-table .danger {
  font-weight: bold;
}
.el-table .warning {
  background-color: rgb(245, 228, 130);
}

.el-table .danger {
  background-color: rgb(243, 152, 152);
}

.dignose-detail-info {
  background-color: rgb(241, 241, 241);
  padding: 10px 40px;
  font-weight: bold;
}

.dignose-detail-info .d-flex {
  margin: 8px;
}

.dignose-detail-info .item-name {
  width: 140px;
}

.btn-share-chart-show {
  height: 32px;
  width: 100%;
  position: relative;
  top: -13px;
}
.showing-down-arrow {
  bottom: -13px;
  z-index: 5001;
  width: 100%;
}
</style>