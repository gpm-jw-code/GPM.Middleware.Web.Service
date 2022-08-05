<template>
  <div class="h-100" style="padding-top:80px">
    <div class="d-flex flex-column" style=";height:100%">
      <!-- 選擇項目與時間 -->
      <div class="d-flex flex-row row settings">
        <div class="col-lg-2 d-flex py-1">
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
                <div v-text="unit_obj.UNIT" style="color:black"></div>
                <div class="w-100" style="text-align:right; ">
                  <u>{{unit_obj.IP}}</u>
                </div>
              </div>
            </el-option>
          </el-select>
        </div>
        <div class="col-lg-2 d-flex">
          <b>查詢項目</b>
          <el-select class="w-100" v-model="QueryOptions.SelectedQueryItem">
            <el-option v-for="item in QueryItems" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div class="col-lg-2 d-flex">
          <b>開始時間</b>
          <el-date-picker
            class="w-100"
            style="width:203px"
            v-model="QueryOptions.TimeRange[0]"
            type="datetime"
          />
        </div>
        <div class="col-lg-2 d-flex">
          <b>結束時間</b>
          <el-date-picker
            class="w-100"
            style="width:203px"
            v-model="QueryOptions.TimeRange[1]"
            type="datetime"
          />
        </div>
        <div class="col-lg-2 flex-fill">
          <b-button class="w-100 bg-primary" @click="QueryHandle">查詢</b-button>
        </div>
      </div>
      <!-- 結果與圖表 -->
      <div class="result d-flex flex-column flex-fill w-100 my-1">
        <div class="d-flex result-message font-red">{{ServerResponseData.message}}</div>
        <GPMPreviewChart
          ref="preview_chart"
          title="Preview"
          :yAxisLabel="Ylabel"
          xAxisLabel
          @DateTimeIntervalOnchanged="GetSliceDataHandle"
        ></GPMPreviewChart>
        <GPMChart
          v-loading="chart_loading"
          class="query-chart flex-fill"
          chart_id="query-chart"
          ref="query_chart"
          :title="`${QueryOptions.SelectedQueryItem}:${QueryOptions.SelectedEQ}/${QueryOptions.SelectedUNIT}`"
          :key="chart_key"
          :yAxisLabel="Ylabel"
        ></GPMChart>
      </div>
      <div class="d-flex flex-row shadow-sm px-2" style="height:25px">
        <div class="flex-fill text-left" style="font-size:9px">{{ServerResponseData.QueryID}}</div>
        <div style="font-size:16px">
          <el-icon style="cursor:pointer" @click="showSettingPnl=!showSettingPnl">
            <setting></setting>
          </el-icon>
        </div>
      </div>
    </div>
    <el-drawer v-model="showSettingPnl" title="SETTING" size="50%">
      <DatabaseSetting></DatabaseSetting>
    </el-drawer>
  </div>
</template>
<script>
import { GetModuleInfos } from '@/APIHelpers/IDMSAPIs'
import GPMChart from '@/components/Charting/GPMChart.vue'
import GPMPreviewChart from '@/components/Charting/GPMPreviewChart.vue'
import DatabaseSetting from './components/DatabaseSetting'
import moment from 'moment';
// import { QueryHealthScore, QueryAlertIndex } from '@/APIHelpers/DatabaseServerAPI';
import { GetModuleInfoStoredInDB, QueryHealthScore, QueryAlertIndex, QueryHealthScoreSplice, GetDatabaseList } from '@/APIHelpers/DatabaseServerAPI';

export default {
  components: {
    GPMChart, GPMPreviewChart, DatabaseSetting
  },
  data() {
    return {

      DatabaseList: [],
      ModuleList: [],
      QueryOptions: {
        SelectedEQ: '',
        SelectedUNIT: '',
        SelectedQueryItem: '',
        TimeRange: []
      },
      QueryItems: ['Raw Data', 'Health Score', 'Alert Index'],
      loading: false,
      chart_loading: false,
      showSettingPnl: false,
      chart_key: '',
      ServerResponseData: {
        count: 0,
        dbConnected: true,
        message: "",
        timeList: [],
        valueList: [],
        QueryID: '-'
      }
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
    }
  },
  methods: {
    async FetchModuleList() {

      this.ModuleList = await GetModuleInfos().catch(async (er) => {
        console.info('IDMS websocket連接失敗,從資料庫調取模組資訊', er);
        var _ModuleList = await GetModuleInfoStoredInDB(); //從IDMS拿不到資訊就從資料庫拿

        return _ModuleList;
      });
      console.info(this.ModuleList);
    },
    async QueryHandle() {
      this.SaveQueryOptionsToLocalStorage();
      this.loading = true;
      new Promise(() => {

        this.$refs.query_chart.Clear();

        if (this.QueryOptions.SelectedQueryItem == 'Health Score')
          QueryHealthScore(this.QueryOptions.SelectedUNIT, this.StartTime, this.EndTime).then(res => { this.RenderChart(res); });
        else if (this.QueryOptions.SelectedQueryItem == 'Alert Index')
          QueryAlertIndex(this.QueryOptions.SelectedUNIT, this.StartTime, this.EndTime).then(res => { this.RenderChart(res); });
        else
          this.loading = false;
      })

    },
    SaveQueryOptionsToLocalStorage() {
      localStorage.setItem('query-options', JSON.stringify(this.QueryOptions));
    },
    ReadQueryOptionsFromLocalStorage() {
      var jsonStr = localStorage.getItem('query-options');
      if (jsonStr) {
        this.QueryOptions = JSON.parse(jsonStr);
      }
    },
    async RenderChart(data) {
      this.ServerResponseData = data;
      if (data.preview != null) {
        this.RenderPreviewChart(data.preview);
      }
      else {
        this.$refs.preview_chart.HidePreviewChart();
        this.RenderFullChart(data);
      }
      this.loading = false;
    },
    async GetSliceDataHandle(datetimeInterval = {}) {
      this.chart_loading = true;
      var data_ret = await QueryHealthScoreSplice(this.ServerResponseData.QueryID, datetimeInterval.from, datetimeInterval.to);
      await this.RenderFullChart(data_ret);

      this.chart_loading = false;
    },
    async RenderFullChart(data, showloading = false) {
      await new Promise((resolve) => {
        var dataset = [];
        data.valueList.forEach(dataInfo => {
          dataset.push({
            label: dataInfo.labelName,
            data: dataInfo.valueList,
            borderColor: dataInfo.displayColor
          });
        })

        this.$refs.query_chart.UpdateChart(data.timeList, dataset, showloading);

        resolve();
      })
    },

    async RenderPreviewChart(previewData) {
      await new Promise((resolve) => {
        this.$refs.preview_chart.UpdatePreviewChart(previewData.TimeLs, previewData.DataLs);
        this.$refs.preview_chart.ShowPreviewChart();
        resolve();
      })
    },
  },
  async mounted() {
    this.FetchModuleList().then(() => {
      this.ReadQueryOptionsFromLocalStorage();
    });
    this.DatabaseList = await GetDatabaseList();
  }
}
</script>
<style>
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
.query-chart {
}

@media screen and (max-width: 900px) {
}
.result-message {
  color: red;
  padding-left: 9px;
  font-weight: bold;
}
</style>