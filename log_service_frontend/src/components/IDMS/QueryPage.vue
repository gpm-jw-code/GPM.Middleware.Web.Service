<template>
  <div class="px-3 h-100" style="padding-top:80px">
    <div class="h-100">
      <!-- 選擇項目與時間 -->
      <div class="row settings">
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
        <div class="col-lg-2 d-flex">
          <b-button class="w-100 bg-primary" @click="QueryHandle">查詢</b-button>
        </div>
      </div>
      <!-- 結果與圖表 -->
      <div class="col-md-8 flex-1 result w-100 h-100">
        <div class="py-2 px-1 my-3 h-100" v-loading="loading">
          <div class="d-flex result-message font-red">{{ServerResponseData.message}}</div>
          <div class="d-flex">統計</div>
          <GPMChart
            class="query-chart"
            chart_id="query-chart"
            ref="query_chart"
            :title="`${QueryOptions.SelectedQueryItem}:${QueryOptions.SelectedEQ}/${QueryOptions.SelectedUNIT}`"
            :key="chart_key"
            :yAxisLabel="Ylabel"
          ></GPMChart>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { GetModuleInfos } from '@/APIHelpers/IDMSAPIs'
import GPMChart from '@/components/Charting/GPMChart.vue'
import moment from 'moment';
import { QueryHealthScore, QueryAlertIndex } from '@/APIHelpers/DatabaseServerAPI';

export default {
  components: {
    GPMChart,
  },
  data() {
    return {

      ModuleList: [],
      QueryOptions: {
        SelectedEQ: '',
        SelectedUNIT: '',
        SelectedQueryItem: '',
        TimeRange: []
      },
      QueryItems: ['Raw Data', 'Health Score', 'Alert Index'],

      loading: false,
      chart_key: '',
      ServerResponseData: {
        count: 0,
        dbConnected: true,
        message: "",
        timeList: [],
        valueList: [],
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
      this.ModuleList = await GetModuleInfos();
    },
    async QueryHandle() {
      this.SaveQueryOptionsToLocalStorage();
      this.loading = true;
      new Promise(() => {

        this.$refs.query_chart.Clear();

        if (this.QueryOptions.SelectedQueryItem == 'Health Score')
          QueryHealthScore(this.QueryOptions.SelectedUNIT, this.StartTime, this.EndTime).then(res => { this.RenderChart(res); });
        if (this.QueryOptions.SelectedQueryItem == 'Alert Index')
          QueryAlertIndex(this.QueryOptions.SelectedUNIT, this.StartTime, this.EndTime).then(res => { this.RenderChart(res); });

        setTimeout(() => {
          this.loading = false;
        }, 400);

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

      await new Promise((resolve) => {
        var dataset = [];
        data.valueList.forEach(dataInfo => {
          dataset.push({
            label: dataInfo.labelName,
            data: dataInfo.valueList,
            borderColor: dataInfo.displayColor
          });
        })

        this.$refs.query_chart.UpdateChart(data.timeList, dataset, false);

        resolve();
      })
    }
  },
  mounted() {
    this.FetchModuleList().then(() => {
      this.ReadQueryOptionsFromLocalStorage();
    });

  }
}
</script>
<style>
.settings b {
  width: 96px;
  text-align: left;
  text-decoration: underline;
}
.settings div {
  margin-top: 1px;
}

.result {
  border: 1px solid black;
  border-radius: 5px;
  margin-top: 20px;
  background-color: rgb(240, 240, 240);
}
.query-chart {
  height: 90%;
}

@media screen and (max-width: 900px) {
  .query-chart {
    height: 70%;
  }
}
.result-message {
  color: red;
  padding-left: 9px;
  font-weight: bold;
}
</style>