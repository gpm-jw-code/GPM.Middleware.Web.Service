<template>
  <div id="dignose-chart-view" v-loading="loading">
    <el-backtop :right="30" :bottom="50" />

    <div class="charting-options py-1 px-1 mx-2 d-flex">
      <div class="d-flex justify-content-start w-100">
        <!-- <span>顯示</span> -->
        <el-radio-group v-model="display_mode" @change="RenderCharts">
          <el-radio-button v-for="mode in display_modes" :key="mode" :label="mode"></el-radio-button>
        </el-radio-group>
      </div>

      <div class="d-flex justify-content-end w-70">
        <div class="py-2" style="width:300px;font-size:16px">Column Number</div>
        <el-select size="large" v-model="ColsNumber" @change="RenderCharts">
          <el-option v-for="num in [1,2,3]" :key="num" :value="num" :label="num"></el-option>
        </el-select>
        <el-input v-model="search_str" placeholder="輸入內容查詢..." clearable>
          <template #prepend>
            <el-icon>
              <Search />
            </el-icon>
          </template>
          <!-- <template #append>
            <el-button>Search</el-button>
          </template>-->
        </el-input>
      </div>

      <div v-if="false" class="d-flex justify-content-start w-100">
        <el-icon class="my-2" @click="settinglock=!settinglock">
          <Lock v-if="!settinglock" />
          <Unlock v-else />
        </el-icon>

        <span>顯示資料筆數(診斷分數)</span>
        <div>
          <el-input-number
            :disabled="settinglock"
            @change="HSDisplayNumChangedHandel"
            v-model="MaxHSDisplayNum"
            size="small"
            number
          ></el-input-number>
        </div>
      </div>
    </div>
    <div class="row g-0">
      <div class="empty-result" v-if="DignoseDatas_Show.length==0">
        <el-empty description="未包含任何圖表項目" :image-size="200" />
      </div>
      <div
        v-else
        v-bind:class="[`col-md-${colsNumReuslt}` , 'charting-region']"
        v-for="data in DignoseDatas_Show"
        :key="data.IP"
      >
        <span class="zoom-icon" :id="data.IP" @click="ZoomClickHandle(data.IP)">
          <el-icon :size="20">
            <ZoomIn />
          </el-icon>
        </span>
        <span class="value-show">{{data.HealthScore}}</span>
        <GPMChart
          @click="ZoomClickHandle(data.IP)"
          :ref="'health-chart-'+data.IP"
          class="chart-h"
          :chart_id="data.IP+'-HealthScore'"
          :title="`${data.EqName}-${data.UnitName}(${data.IP})`"
          :yAxisLabel="ylabel"
          :key="ylabel+ColsNumber"
        ></GPMChart>
      </div>
    </div>

    <el-drawer v-model="zooming" direction="btt" size="90%">
      <GPMChart
        ref="zoom-chart"
        @click="zooming=false"
        class="chart-zoom"
        chart_id="zoom-chart"
        :title="`${zoom_data.EqName}-${zoom_data.UnitName}(${zoom_data.IP})`"
        :yAxisLabel="ylabel"
        :key="zoom_data.IP"
      ></GPMChart>
    </el-drawer>
  </div>
</template>

<script>
import GPMChart from '@/components/Charting/GPMChart';
import { configs } from '@/config';
// import moment from 'moment';
export default {
  props: {
    pause: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      ws: null,
      loading: true,
      DignoseDatas: [],
      zoom_data: {
        EqName: "",
        UnitName: "",
        IP: ""
      },
      MaxHSDisplayNum: 50,
      settinglock: true,
      display_mode: 'Health Score',
      display_modes: ['Health Score', 'Alert Index(day)', 'Alert Index(Hour)'],
      search_str: '',
      ColsNumber: 2,
      zooming: false,
      zoomingIP: ''
    }
  },
  computed: {
    DignoseDatas_Show() {
      if (this.search_str == '')
        return this.DignoseDatas;
      else {
        var _search_str = this.search_str.toUpperCase();
        var outputList = [];
        this.DignoseDatas.forEach(item => {
          if (item.IP.toUpperCase().includes(_search_str) | item.EqName.toUpperCase().includes(_search_str) | item.UnitName.toUpperCase().includes(_search_str) | (item.EqName + "-" + item.UnitName).toUpperCase().includes(_search_str)) {
            outputList.push(item);
          }
        });
        return outputList;
      }

    },
    ylabel() {
      if (this.display_mode == 'Health Score')
        return 'Score';
      if (this.display_mode == 'Alert Index(day)' | this.display_mode == 'Alert Index(Hour)')
        return 'Index';
      return "";

    }, colsNumReuslt() {
      return 12 / this.ColsNumber;
    }
  },
  methods: {
    ZoomClickHandle(ip) {
      this.zooming = true;
      this.zoom_data = this.DignoseDatas.find(i => i.IP == ip);
      var chartingObj = this.GenChartData(this.zoom_data, this.display_mode);
      var timeList = chartingObj.timeLs;
      var datasets = chartingObj.datasets;
      setTimeout(() => {
        this.$refs["zoom-chart"].Update(timeList, datasets);
      }, 200);
      this.zoomingIP = ip;
    },
    async RenderCharts() {
      if (this.pause)
        return;
      this.DignoseDatas.forEach(data => {
        var chartingObj = this.GenChartData(data, this.display_mode);
        var timeList = chartingObj.timeLs;
        var datasets = chartingObj.datasets;

        var chart_ref = this.$refs[`health-chart-${data.IP}`]
        if (chart_ref && chart_ref[0])
          chart_ref[0].Update(timeList, datasets);

        //render zoom data 
        if (this.zooming && data.IP == this.zoomingIP) {

          this.zoom_data = data;
          this.$refs["zoom-chart"].Update(timeList, datasets);
        }

      });
    },
    GenChartData(data, display_mode) {
      var chartData;
      var borderColor = 'gold';

      if (display_mode == 'Health Score') {
        chartData = data.chartDatas.healthScoreList;
        borderColor = 'rgb(21, 237, 201)';
      }

      if (display_mode == 'Alert Index(day)')
        chartData = data.chartDatas.alertIndex_by_Day_List;

      if (display_mode == 'Alert Index(Hour)')
        chartData = data.chartDatas.alertIndex_by_Hour_List;

      if (chartData.length == 0) {
        return;
      }

      var timeList = chartData.timeList;
      var scoreList = chartData.valueList;

      var datasets = [
        {
          label: display_mode.toString(),
          data: scoreList,
          borderColor: borderColor
        }
      ];
      return { timeLs: timeList, datasets: datasets }
    },
    WsConnect() {
      this.ws = new WebSocket(`${configs.idms_websocket_host}/Dignose?type=chart&number=${this.MaxHSDisplayNum}`);
      this.ws.onopen = () => {
        this.loading = false;
      }
      this.ws.onmessage = (_ws) => {
        this.loading = false;
        this.DignoseDatas = JSON.parse(_ws.data);
        this.RenderCharts();
      }
      this.ws.onclose = () => {
        console.info('ws close');
        this.loading = true;
        this.ws.onmessage = null;
        this.WsConnect();
      }

    },
    HSDisplayNumChangedHandel() {
      console.info(this.MaxHSDisplayNum);
      this.ws.onmessage = null;
      this.ws.close();
      this.WsConnect();
    }
  },
  components: { GPMChart },
  mounted() {
    this.WsConnect();
  },
  unmounted() {
    this.ws.close();
  }
}
</script>

<style  scoped>
#dignose-chart-view {
  background-color: #ffffff;
  margin-top: 5px;
}
.charting-options {
  border: 1px solid grey;
  border-radius: 0.4rem;
}

.charting-options span {
  margin-right: 12px;
  padding-top: 4px;
}

.chart-h {
  height: 220px;
}
.chart-zoom {
  height: 100%;
}

.charting-options {
  flex-direction: row;
}

.empty-result {
  font-size: large;
}
.charting-region {
  position: relative;
}

.charting-region .zoom-icon {
  right: 20px;
  top: 10px;
  cursor: pointer;
}

.charting-region .value-show {
  left: 20px;
  bottom: 6px;
  font-size: 30px;
  cursor: pointer;
  font-weight: bold;
}

.charting-region span {
  position: absolute;
  color: white;
}

.el-drawer__body {
  background-color: pink;
}
</style>