<template>
  <div id="dignose-chart-view" v-loading="loading">
    <div class="charting-options d-flex py-1 px-3">
      <el-button
        size="small"
        class="mx-2"
        @click="settinglock=!settinglock"
      >{{settinglock?'UnLock':'Lock'}}</el-button>
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
    <div class="row">
      <div class="col-md-6" v-for="data in DignoseDatas" :key="data.IP">
        <GPMChart
          :ref="'health-chart-'+data.IP"
          class="chart-h"
          :id="data.IP+'-HealthScore'"
          :title="data.EqName+'-'+data.UnitName"
        ></GPMChart>
      </div>
      <!-- <div class="col-md-6">
        <GPMChart class="chart-h" :id="i+'b'" title="--"></GPMChart>
      </div>-->
    </div>
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
      MaxHSDisplayNum: 50,
      settinglock: true

    }
  },
  methods: {
    async RenderCharts() {
      if (this.pause)
        return;
      this.DignoseDatas.forEach(data => {
        var timeList = Object.keys(data.chartDatas.healthScoreList);
        var scoreList = Object.values(data.chartDatas.healthScoreList);
        var datasets = [
          {
            label: "Health Score",
            data: scoreList,
            borderColor: 'gold'
          }
        ];
        var chart_ref = this.$refs[`health-chart-${data.IP}`]
        if (chart_ref && chart_ref[0])
          chart_ref[0].Update(timeList, datasets);
      });
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

    }, HSDisplayNumChangedHandel() {
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
  border: 1px dashed black;
}

.charting-options span {
  margin-right: 12px;
}

.chart-h {
  height: 220px;
}
</style>