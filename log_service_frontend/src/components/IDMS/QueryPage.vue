<template>
  <div class="h-100 fade-in">
    <div class="d-flex flex-column" style=";height:100%">
      <!-- 選擇項目與時間 -->
      <div v-loading="!ready" class="options border-bottom border-top pb-2 mt-1 mb-1">
        <div class="d-flex flex-row row settings">
          <div class="col-lg-2 d-flex">
            <b>EQ</b>
            <el-select
              class="w-100"
              v-model="QueryOptions.SelectedEQ"
              @change="QueryOptions.SelectedUNIT=''"
            >
              <el-option v-for="eq in EQList" :key="eq" :label="eq" :value="eq"></el-option>
            </el-select>
          </div>
          <div class="col-lg-2 d-flex">
            <b>UNIT</b>
            <el-select class="w-100" v-model="QueryOptions.SelectedUNIT ">
              <el-option
                v-for="unit_obj in UNITS_IN_EQ"
                :key="unit_obj.IP"
                :label="`${unit_obj.UNIT}(${unit_obj.IP})`"
                :value="unit_obj.IP"
              >
                <div class="d-flex">
                  <div v-text="unit_obj.UnitName" style="color:black"></div>
                  <div class="w-100" style="text-align:right; ">
                    {{unit_obj.UNIT}}
                    <u>{{unit_obj.IP}}</u>
                  </div>
                </div>
              </el-option>
            </el-select>
          </div>
          <div class="col-lg-2 d-flex">
            <b>查詢項目</b>
            <el-select
              class="w-100"
              v-model="QueryOptions.SelectedQueryItem"
              @change="QueryItemChangeHandle"
            >
              <el-option
                v-for="item in QueryItems"
                :key="item.label"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </div>
          <!-- <div class="col-lg-2 d-flex">
            <b>類型</b>
            <el-select
              class="w-100"
              v-model="selectedTabpage"
              @change="QueryOptions.SelectedEvent=''"
            >
              <el-option
                v-for="item in TypeItems"
                :key="item.name"
                :label="item.label"
                :value="item.name"
              ></el-option>
            </el-select>
          </div>
          <div v-if="selectedTabpage=='eventTabpage'" class="col-lg-2 d-flex">
            <b>事件?</b>
            <el-select class="w-100" v-model="QueryOptions.SelectedEvent">
              <el-option
                v-for="item in EventQueryOptions"
                :key="item "
                :label="item "
                :value="item "
              ></el-option>
            </el-select>
          </div>-->
          <!-- 用來填空的^_^ -->
          <div v-if="selectedTabpage!='eventTabpage'" class="col-lg-2 flex-fill"></div>
          <!-- <div class="col-lg-2">
            <b-button class="w-100 bg-danger">清除</b-button>
          </div>-->
        </div>
        <div class="d-flex flex-row row settings">
          <div class="col-lg-4 d-flex">
            <b>開始時間</b>
            <el-date-picker
              class="w-100"
              style="width:203px"
              v-model="QueryOptions.TimeRange[0]"
              type="datetime"
            />
          </div>
          <div class="col-lg-4 d-flex">
            <b>結束時間</b>
            <el-date-picker
              class="w-100"
              style="width:203px"
              v-model="QueryOptions.TimeRange[1]"
              type="datetime"
            />
          </div>
          <div class="col-lg-2 flex-fill"></div>
          <div class="col-lg-2">
            <b-button class="w-100 bg-primary" @click="QueryHandle">查詢</b-button>
          </div>
        </div>
      </div>

      <!-- <el-divider></el-divider> -->
      <!-- TABPAGE 控制 -->
      <!-- <div class="px-1 py-0">
        <el-tabs type="card" class="flex-fill" v-model="selectedTabpage">
          <el-tab-pane
            v-for="item in TypeItems"
            :key="item.name"
            :label="item.label"
            :name="item.name"
            class="d-flex flex-column"
          ></el-tab-pane>
        </el-tabs>
      </div>-->
      <!-- 結果與圖表 -->
      <div
        class="result-content d-flex flex-column flex-fill w-100 h-100"
        style="position:relative;"
      >
        <div
          v-show="selectedTabpage=='dataTabpage'"
          class="result d-flex flex-column flex-fill w-100 my-1"
          v-loading="loading"
          element-loading-text="數據載入中...若響應速度過慢,可以試試將查詢時間區間縮短。"
          element-loading-background="rgba(122, 122, 122, 0.8)"
        >
          <div class="d-flex flex-row" style="position:absolute;left:15px;top:15px;cursor:pointer">
            <i @click="showAxisSetting=true" class="bi bi-sliders2-vertical"></i>
            <div class="d-flex result-message font-red">{{ServerResponseData.message}}</div>
          </div>
          <GPMChart
            v-loading="chart_loading"
            element-loading-text="數據載入中...若響應速度過慢,可以試試調整窗大小。"
            element-loading-background="rgba(122, 122, 122, 0.8)"
            class="query-chart flex-fill"
            chart_id="query-chart"
            ref="query_chart"
            :title="`${QueryOptions.SelectedQueryItem}:${QueryOptions.SelectedEQ}/${QueryOptions.SelectedUNIT}`"
            :key="chart_key"
            :yAxisLabel="Ylabel"
          ></GPMChart>
        </div>
        <div
          v-show="selectedTabpage=='eventTabpage'"
          class="w-100 h-100 bg-light"
          style="position:absolute;z-index:3000"
        >
          <EventQueryResultView
            ref="Event_QueryHelper"
            :queryItem="QueryOptions.SelectedQueryItem"
            :eventItem="QueryOptions.SelectedEvent"
            :ip="QueryOptions.SelectedUNIT"
            :from="StartTime"
            :to="EndTime"
          ></EventQueryResultView>
        </div>
      </div>
      <!-- 
      <div class="info-footer d-flex flex-row shadow-sm px-2" style="height:25px">
        <div class="flex-fill text-left" style="font-size:9px">{{ServerResponseData.QueryID}}</div>
        <div style="font-size:16px">
          <el-icon style="cursor:pointer" @click="showSettingPnl=!showSettingPnl">
            <setting></setting>
          </el-icon>
        </div>
      </div>-->
    </div>

    <!-- <el-drawer v-model="showSettingPnl" title="SETTING" :size="IsMobileScreen?'100%':'50%'">
      <DatabaseSetting></DatabaseSetting>
    </el-drawer>-->

    <el-drawer
      v-model="showAxisSetting"
      direction="btt"
      size="40%"
      :show-close="false"
      :z-index="5000"
    >
      <template #header="{titleID}">
        <div :id="titleID" class="border-bottom d-flex flex-row">
          <h4 class="flex-fill">圖表設定</h4>
          <el-button class size="small" circle icon="close" @click="showAxisSetting=false"></el-button>
        </div>
      </template>
      <div class="h-100" style="position:absolute;top:60px;right: 12px;left:  12px;">
        <el-tabs v-model="SelectedQueryItem" class="demo-tabs">
          <el-tab-pane
            v-for="setting in CustomChartSetting"
            :key="setting.item"
            :label="setting.item"
            :name="setting.item"
          >
            <div class="chart-settings d-flex flex-column">
              <div class="d-flex flex-row sub-setting">
                <div>
                  <el-tag size="large" class="item-name">Y軸</el-tag>
                </div>
                <div>
                  <el-checkbox
                    v-model="setting.yAutoScale"
                    @change="AutoScaleHandle(setting)"
                  >Auto Scale</el-checkbox>
                </div>
                <div>Max</div>
                <div>
                  <b-form-input
                    :disabled="setting.yAutoScale"
                    v-model.number="setting.ymax"
                    type="number"
                    :step="0.1"
                  ></b-form-input>
                </div>
                <div>Min</div>
                <div>
                  <b-form-input
                    :disabled="setting.yAutoScale"
                    v-model.number="setting.ymin"
                    type="number"
                    :step="0.1"
                  ></b-form-input>
                </div>
                <div>
                  <b-button
                    :disabled="setting.yAutoScale"
                    size="md"
                    @click="ChartYLimitsApplyHandle"
                  >Apply</b-button>
                </div>
              </div>
              <div class="d-flex flex-row sub-setting">
                <div>
                  <el-tag size="large" class="item-name">Colors</el-tag>
                </div>
                <div
                  class="d-flex flex-row mx-0 my-0 px-0 py-0"
                  v-for="(val,key) in setting.customSetting"
                  :key="key"
                >
                  <div>{{key}}</div>
                  <div class="mx-0 my-0 px-0 pb-2">
                    <el-color-picker
                      color-format="rgb"
                      v-model="val.borderColor"
                      @active-change="ColorChangeHandle(setting,key,val.borderColor)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { GetModuleInfos } from '@/APIHelpers/IDMSAPIs'
import GPMChart from '@/components/Charting/GPMChart.vue'
// import GPMPreviewChart from '@/components/Charting/GPMPreviewChart.vue'
// import DatabaseSetting from './components/DatabaseSetting'
import EventQueryResultView from './components/EventQueryResultView'
import moment from 'moment';
// import { QueryHealthScore, QueryAlertIndex } from '@/APIHelpers/DatabaseServerAPI';
import {
  GetEdgeNameByIP,
  GetModuleInfoStoredInDB, QueryVibrationEnergy, QueryVibration_raw_data,
  QueryHealthScore, QueryAlertIndex, QueryPhysical_quantity, QuerySideBandSeverity, QueryFrequency_doublingSeverity,
  QuerySplice, GetDatabaseList, QueryVibration_raw_data_with_QueryID
} from '@/APIHelpers/DatabaseServerAPI';

export default {
  components: {
    GPMChart, EventQueryResultView
  },
  data() {
    return {
      edge_ip: '',
      edge_name: '',
      ready: false,
      selectedTabpage: 'dataTabpage',
      TypeItems: [{ name: 'dataTabpage', label: '數據' }, { name: 'eventTabpage', label: '事件' }],
      DatabaseList: [],
      ModuleList: [],
      QueryOptions: {
        SelectedEQ: '',
        SelectedUNIT: '',
        SelectedQueryItem: '',
        SelectedEvent: '',
        TimeRange: []
      },
      SelectedQueryItem: '',
      // QueryItems: ['Raw Data', 'Health Score', 'Alert Index', '振動能量', 'Physical Quanity', 'Sideband Severity', 'FrequencyDoubling Severity'],
      QueryItems: [
        {
          label: 'Health Score',
          eventOptions: ['Out Of Threshold'],
        },
        {
          label: 'Raw Data',
          eventOptions: []
        },
        {
          label: 'Alert Index',
          eventOptions: [],
          YAxisSetting: {
            max: 100,
            min: 0
          }
        },
        {
          label: '振動能量',
          eventOptions: []
        },
        {
          label: 'Physical Quanity',
          eventOptions: []
        }, {
          label: 'Sideband Severity',
          eventOptions: ['Out Of Threshold']
        },
        {
          label: 'FrequencyDoubling Severity',
          eventOptions: []
        }],
      loading: false,
      chart_loading: false,
      showSettingPnl: false,
      showAxisSetting: false,
      chart_key: '',
      ServerResponseData: {
        count: 0,
        dbConnected: true,
        message: "",
        timeList: [],
        valueList: [],
        QueryID: '-'
      },
      FetchDataStartTime: null,
      FetchDataFinishTime: null,
      CustomChartSetting: [
        {
          item: 'Health Score',
          ymax: 100,
          ymin: 0,
          customSetting: {

          },
          ymaxOfAllData: 100,
          yminOfAllData: 0,
          yAutoScale: false
        },
        {
          item: 'Raw Data',
          ymax: 100,
          ymin: 0,
          customSetting: {

          },
          ymaxOfAllData: 100,
          yminOfAllData: 0,
          yAutoScale: false
        },
        {
          item: 'Alert Index',
          ymax: 100,
          ymin: 0,
          customSetting: {

          },
          ymaxOfAllData: 100,
          yminOfAllData: 0,
          yAutoScale: false
        },
        {
          item: '振動能量',
          ymax: 100,
          ymin: 0,
          customSetting: {

          },
          ymaxOfAllData: 100,
          yminOfAllData: 0,
          yAutoScale: false
        },
        {
          item: 'Physical Quanity',
          ymax: 100,
          ymin: 0,
          customSetting: {

          },
          ymaxOfAllData: 100,
          yminOfAllData: 0,
          yAutoScale: false
        },
        {
          item: 'Sideband Severity',
          ymax: 100,
          ymin: 0,
          customSetting: {

          },
          ymaxOfAllData: 100,
          yminOfAllData: 0,
          yAutoScale: false
        },
        {
          item: 'FrequencyDoubling Severity',
          ymax: 100,
          ymin: 0,
          customSetting: {

          },
          ymaxOfAllData: 100,
          yminOfAllData: 0,
          yAutoScale: false
        }
      ]


    }
  },
  computed: {
    EQList() {
      var eqls = [];
      this.ModuleList.forEach(module => {
        if (!eqls.includes(module.EQ)) {
          eqls.push(module.EQ);
        }
      })
      return eqls;
    },
    UNITS_IN_EQ() {
      return this.ModuleList.filter(m => m.EQ == this.QueryOptions.SelectedEQ);
    },
    StartTime() {
      return moment(this.QueryOptions.TimeRange[0]).format('yyyy/MM/DD HH:mm:ss');
    },
    EndTime() {
      return moment(this.QueryOptions.TimeRange[1]).format('yyyy/MM/DD HH:mm:ss');
    },
    Ylabel() {
      if (this.QueryOptions.SelectedQueryItem == 'Raw Data')
        return 'G';
      if (this.QueryOptions.SelectedQueryItem == 'Health Score')
        return 'Score';
      if (this.QueryOptions.SelectedQueryItem == 'Alert Index')
        return 'Index';
      return '';
    },
    IsMobileScreen() {
      return window.screen.width < 600;
    },
    EventQueryOptions() {
      return this.QueryItems.find(i => i.label == this.QueryOptions.SelectedQueryItem).eventOptions;
    },
    ChartTitle() {
      return `${this.QueryOptions.SelectedQueryItem}:${this.QueryOptions.SelectedEQ}/${this.QueryOptions.SelectedUNIT}`;
    }
  },
  methods: {
    async FetchModuleList() {

      // this.ModuleList = await GetModuleInfos(this.edge_ip).catch(async (er) => {
      //   console.info('IDMS websocket連接失敗,從資料庫調取模組資訊', er);
      //   var _ModuleList = await GetModuleInfoStoredInDB(); //從IDMS拿不到資訊就從資料庫拿
      //   return _ModuleList;
      // });
      this.ModuleList = await GetModuleInfoStoredInDB(this.edge_name); //從IDMS拿不到資訊就從資料庫拿
      this.ready = true;
      console.info(this.ModuleList);
    },
    QueryItemChangeHandle(item) {
      if (item == 'Raw Data')
        alert("資料量龐大會有點慢")
      this.SelectedQueryItem = item;
    },
    async QueryHandle() {
      this.$refs.query_chart.UpdateTitle(this.ChartTitle);
      this.loading = true;
      this.SaveQueryOptionsToLocalStorage();
      setTimeout(() => {
        if (this.selectedTabpage == 'dataTabpage') {
          this.FetchDataStartTime = Date.now();
          let chart_pixel = this.$refs.query_chart.GetPixel();
          new Promise(() => {
            this.$refs.query_chart.Clear();

            let customSetting = this.GetCustomSetting();

            if (this.QueryOptions.SelectedQueryItem == 'Health Score')
              QueryHealthScore(this.edge_name, this.QueryOptions.SelectedUNIT, this.StartTime, this.EndTime, chart_pixel, customSetting).then(res => { this.RenderChart(res); });
            else if (this.QueryOptions.SelectedQueryItem == 'Alert Index')
              QueryAlertIndex(this.edge_name, this.QueryOptions.SelectedUNIT, this.StartTime, this.EndTime, chart_pixel, customSetting).then(res => { this.RenderChart(res); });
            else if (this.QueryOptions.SelectedQueryItem == '振動能量')
              QueryVibrationEnergy(this.edge_name, this.QueryOptions.SelectedUNIT, this.StartTime, this.EndTime, chart_pixel, customSetting).then(res => { this.RenderChart(res); });
            else if (this.QueryOptions.SelectedQueryItem == 'Raw Data') {
              QueryVibration_raw_data(this.edge_name, this.QueryOptions.SelectedUNIT, this.StartTime, this.EndTime, chart_pixel, customSetting).then(res => { this.RenderChart(res); });
            }
            else if (this.QueryOptions.SelectedQueryItem == 'Physical Quanity') {
              QueryPhysical_quantity(this.edge_name, this.QueryOptions.SelectedUNIT, this.StartTime, this.EndTime, chart_pixel, customSetting).then(res => { this.RenderChart(res); });
            }
            else if (this.QueryOptions.SelectedQueryItem == 'Sideband Severity') {
              QuerySideBandSeverity(this.edge_name, this.QueryOptions.SelectedUNIT, this.StartTime, this.EndTime, chart_pixel, customSetting).then(res => { this.RenderChart(res); });
            }
            else if (this.QueryOptions.SelectedQueryItem == 'FrequencyDoubling Severity') {
              QueryFrequency_doublingSeverity(this.edge_name, this.QueryOptions.SelectedUNIT, this.StartTime, this.EndTime, chart_pixel, customSetting).then(res => { this.RenderChart(res); });
            }
            else
              this.loading = false;
          })
        }
        else {
          this.$refs.Event_QueryHelper.QueryHandle();
        }
      }, 100);


    },
    SaveQueryOptionsToLocalStorage() {
      var jsonStr = localStorage.getItem('query-options-by-edge');
      var edgeOptions = {};
      if (jsonStr) {
        edgeOptions = JSON.parse(jsonStr);
        edgeOptions[this.edge_name] = this.QueryOptions;
      } else {
        edgeOptions[this.edge_name] = this.QueryOptions;
      }
      localStorage.setItem('query-options-by-edge', JSON.stringify(edgeOptions));
      localStorage.setItem('query-chart-setting', JSON.stringify(this.CustomChartSetting));

    },
    ReadQueryOptionsFromLocalStorage() {
      var jsonStr = localStorage.getItem('query-options-by-edge');
      if (jsonStr) {
        var edges_caches = JSON.parse(jsonStr);
        var _edge_opt = edges_caches[this.edge_name];
        if (_edge_opt) {
          this.QueryOptions = _edge_opt
        } else {
          this.QueryOptions.SelectedEQ = ''
          this.QueryOptions.SelectedUNIT = ''
        }

        this.SelectedQueryItem = this.QueryOptions.SelectedQueryItem;
      }
      var jsonStr_CustomChart = localStorage.getItem('query-chart-setting');
      if (jsonStr_CustomChart) {
        this.CustomChartSetting = JSON.parse(jsonStr_CustomChart);
        this.SetChartYLimits();
      }

    },
    async RenderChart(data) {
      this.ServerResponseData = data;
      if (this.ServerResponseData.message) {//表示有錯誤
        this.loading = false;
        return;
      }
      this.FetchDataFinishTime = Date.now();
      // var timeEscapse = moment(this.FetchDataFinishTime - this.FetchDataStartTime).seconds();
      // console.info('Fetch Data 花費 :', timeEscapse, `${data.labels.length}筆`);
      this.$toast.success('Done', { position: 'top-right', duration: 2000 });
      this.ServerResponseData = data;
      //把style設定存起來
      this.SyncStyleSetting(data);
      this.RenderFullChart(data);
      this.loading = false;
      console.info(this.CustomChartSetting);
    },
    ColorChangeHandle(setting, key, borderColor) {
      console.info(setting, key, borderColor);
    },
    SyncStyleSetting(data) {
      var setting = this.CustomChartSetting.find(vm => vm.item == this.QueryOptions.SelectedQueryItem);
      //暫存數據最大最小值 用來做auto scale調整
      setting.ymaxOfAllData = data.ymaxOfAllData;
      setting.yminOfAllData = data.yminOfAllData;

      setting.customSetting = {};
      data.datasets.forEach(dataset => {
        setting.customSetting[dataset.label] = {
          backgroundColor: dataset.backgroundColor,
          borderColor: dataset.borderColor,
          borderWidth: dataset.borderWidth,
          fill: dataset.fill,
          label: dataset.label,
          lineTension: dataset.lineTension,
          pointRadius: dataset.pointRadius,
          pointStyle: dataset.pointStyle,
        }
      })
      this.SaveQueryOptionsToLocalStorage();
    },
    async GetSliceDataHandle(datetimeInterval = {}) {

      this.chart_loading = true;
      var data_ret = {};

      if (this.QueryOptions.SelectedQueryItem == 'Raw Data') {
        data_ret = await QueryVibration_raw_data_with_QueryID(this.edge_name, this.QueryOptions.SelectedUNIT, datetimeInterval.from, datetimeInterval.to, "givemedetail");
      } else {
        data_ret = await QuerySplice(this.ServerResponseData.QueryID, datetimeInterval.from, datetimeInterval.to);
      }

      await this.RenderFullChart(data_ret);
      this.chart_loading = false;
    },
    async RenderFullChart(data, showloading = false) {
      await new Promise((resolve) => {
        this.$refs.query_chart.UpdateChart(data, showloading);
        this.CustomStyleSetting();
        resolve();
      })
    },
    CustomStyleSetting() {
      this.SetChartYLimits();
    },
    async RenderPreviewChart(previewData) {
      await new Promise((resolve) => {
        this.$refs.preview_chart.UpdatePreviewChart(previewData);
        this.$refs.preview_chart.ShowPreviewChart();
        resolve();
      })
    },
    AutoScaleHandle(settings) {
      if (settings.item == this.QueryOptions.SelectedQueryItem) {
        if (settings.yAutoScale) {
          this.$refs.query_chart.SetYAxisLimits(settings.ymaxOfAllData, settings.yminOfAllData);
        } else {
          this.$refs.query_chart.SetYAxisLimits(settings.ymax, settings.ymin);
        }
      }
      else
        this.$toast.success('下次查詢時將會生效', { position: 'bottom', duration: 1000 });
      this.SaveQueryOptionsToLocalStorage();

    },
    ChartYLimitsApplyHandle() {
      var setting = this.CustomChartSetting.find(vm => vm.item == this.QueryOptions.SelectedQueryItem);
      var max = setting.ymax;
      var min = setting.ymin;
      if (this.SelectedQueryItem == this.QueryOptions.SelectedQueryItem)
        this.$refs.query_chart.SetYAxisLimits(max, min);
      else {
        this.$toast.success('下次查詢時將會生效', { position: 'bottom', duration: 1000 });
      }
      this.SaveQueryOptionsToLocalStorage();
    },
    SetChartYLimits() {
      var setting = this.CustomChartSetting.find(vm => vm.item == this.QueryOptions.SelectedQueryItem);
      this.AutoScaleHandle(setting);
      // var max = setting.ymax;
      // var min = setting.ymin;
      // this.$refs.query_chart.SetYAxisLimits(max, min);

    },
    GetCustomSetting() {
      var setting = this.CustomChartSetting.find(vm => vm.item == this.QueryOptions.SelectedQueryItem);
      if (setting.customSetting == undefined) {
        setting.customSetting = {};
      }
      let json = JSON.stringify(setting.customSetting);
      console.info(setting, json);
      return JSON.stringify(setting.customSetting);
    }
  },
  async mounted() {
    setTimeout(async () => {
      this.edge_ip = this.$route.query.ip;
      if (this.$route.query.edgename == undefined) {
        this.edge_name = await GetEdgeNameByIP(this.edge_ip)
      } else
        this.edge_name = this.$route.query.edgename;
      this.FetchModuleList().then(() => {
        this.ReadQueryOptionsFromLocalStorage();
        this.$refs.query_chart.UpdateTitle(this.ChartTitle);
      });
      this.DatabaseList = await GetDatabaseList();
    }, 10);
  }
}
</script>
<style>
.options {
  box-shadow: 4px 1px 10px 1px rgba(0, 0, 0, 0.644);
}
.settings b {
  font-size: small;
  width: 96px;
  text-align: left;
  text-decoration: underline;
}
.settings div {
  margin-top: 1px;
}

.result {
  /* border: 1px solid black;
   */
  color: white;
  border-radius: 2px;
  background-color: rgb(39, 39, 39);
  margin-top: 20px;
}
.info-footer {
  background-color: rgb(11, 94, 215);
  color: white;
}

@media screen and (max-width: 900px) {
}
.result-message {
  color: red;
  padding-left: 9px;
  font-weight: bold;
}
.chart-settings .sub-setting {
  border-bottom: 0.1rem solid rgb(219, 219, 219);
}
.chart-settings div div {
  margin: 10px;
  height: 40px;
}
.chart-settings .item-name {
  width: 70px;
  text-align: left;
}
</style>