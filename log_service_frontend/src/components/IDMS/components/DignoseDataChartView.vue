<template>
  <div id="dignose-chart-view" v-loading="LOADING">
    <el-affix :offset="65" class="w-100">
      <div class="charting-options w-100 py-1 px-1 mx-2 d-flex bg-light row">
        <div class="col-md-6">
          <div class="d-flex justify-content-start w-100">
            <!-- <span>顯示</span> -->
            <el-radio-group v-model="display_mode" @change="FeatureTypeChangeHandle">
              <el-radio-button
                size="small"
                v-for="mode in display_modes"
                :key="mode.value"
                :label="mode.label"
              ></el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="col-md-6 text-start">
          <div class="d-flex justify-content-end w-70">
            <div style="width:150px;font-size:12px">Column Number</div>
            <el-select size="default" v-model="ColsNumber" @change="RenderCharts">
              <el-option v-for="num in [1,2,3]" :key="num" :value="num" :label="num"></el-option>
            </el-select>
            <el-input size="small" v-model="search_str" placeholder="輸入內容查詢..." clearable>
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
      </div>
    </el-affix>

    <div class="row g-0" id="chccccc">
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

        <span
          v-show="featureType=='HS'"
          class="value-show"
        >{{data.datasets==undefined? -1:data.datasets[0].data[data.datasets[0].data.length-1]}}</span>

        <GPMChart
          :ref="'health-chart-'+data.IP"
          class="chart-h"
          :chart_id="data.IP+'-HealthScore'"
          :title="`${data.EqName}-${data.UnitName}(${data.IP})`"
          :yAxisLabel="ylabel"
          :key="ylabel+ColsNumber"
          :skipRenderIfOutOfViewPort="true"
        ></GPMChart>
      </div>
    </div>

    <el-drawer v-model="zooming" direction="btt" size="90%">
      <span>看看其他的 :</span>
      <el-select v-model="zoomingIP">
        <el-option
          v-for="data in DignoseDatas_Show"
          :key="data.IP"
          :value="data.IP"
          :label="`${data.EqName}-${data.UnitName}(${data.IP})`"
        ></el-option>
      </el-select>
      <GPMChart
        ref="zoom-chart"
        class="chart-zoom"
        chart_id="zoom-chart"
        :title="`${zoom_data.EqName}-${zoom_data.UnitName}(${zoom_data.IP})`"
        :yAxisLabel="ylabel"
        :key="zoom_data.IP"
        :skipRenderIfOutOfViewPort="false"
      ></GPMChart>
    </el-drawer>
  </div>
</template>

<script>
import GPMChart from '@/components/Charting/GPMChart';
import { configs } from '@/config';
import { GenDiagnoseChartData, display_modes } from '../Helpers';
// import moment from 'moment';
export default {
  props: {
    pause: {
      type: Boolean,
      default: true
    },
    edgeIP: {
      type: String,
      default: "127.0.0.1"
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
      display_modes: display_modes,
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

    },
    colsNumReuslt() {
      return 12 / this.ColsNumber;
    },
    selected_display_mode_value() {
      return this.display_modes.find(mod => mod.label == this.display_mode).value;
    },
    featureType() {
      var type = this.display_mode == 'Health Score' ? 'HS' : this.display_mode == 'Alert Index(day)' ? 'AID' : 'AIH';
      return type;
    },
    LOADING() {
      return process.env.NODE_ENV == 'production' ? this.loading : false;
    }
  },
  methods: {
    visibilityChanged(isVisible, entry) {
      console.log(isVisible, entry)
    },
    ZoomClickHandle(ip) {
      this.zooming = true;
      this.zoom_data = this.DignoseDatas.find(i => i.IP == ip);
      setTimeout(() => {
        this.$refs["zoom-chart"].UpdateChart(this.zoom_data);
      }, 200);
      this.zoomingIP = ip;
    },
    FeatureTypeChangeHandle() {
      if (this.ws) {
        this.ws.close();
      }
      // this.WsConnect();
    },
    async RenderCharts() {


      if (this.pause)
        return;

      this.DignoseDatas.forEach(data => {
        new Promise(reslove => {
          var timeUnit = this.display_mode == 'Health Score' ? 'second' : this.display_mode == 'Alert Index(day)' ? 'day' : 'hour';
          var chart_ref = this.$refs[`health-chart-${data.IP}`]
          if (chart_ref && chart_ref[0])
            chart_ref[0].UpdateChart(data, timeUnit);

          //render zoom data 
          if (this.zooming && data.IP == this.zoomingIP) {
            this.zoom_data = data;
            this.$refs["zoom-chart"].UpdateChart(data, timeUnit);
          }
          reslove();
        })

      });
    },

    WsConnect() {

      if (this.ws)
        this.ws.close();

      this.ws = new WebSocket(`${configs.websocket_host}/Dignose?edgeIP=${this.edgeIP}&type=chart&number=${this.MaxHSDisplayNum}&chart_type=${this.featureType}&sensorIP=ALL`);
      this.ws.onopen = () => {
        this.loading = false;
      }
      this.ws.onmessage = (evt) => {
        this.loading = false;
        this.DignoseDatas = JSON.parse(evt.data);
        this.RenderCharts();
      }
      this.ws.onerror = () => {
        console.info('ws close');
        this.loading = true;
        this.ws.onmessage = null;
        this.WsConnect();

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