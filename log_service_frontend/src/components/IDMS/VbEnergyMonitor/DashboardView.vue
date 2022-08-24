<template>
  <div class="fade-in bg-light">
    <div class="d-flex flex-row justify-content-end">
      <div>顯示行數:</div>
      <div style="width:60px">
        <el-select size="small" v-model="ColsNumber">
          <el-option v-for="num in [1,2,3]" :key="num" :value="num" :label="num"></el-option>
        </el-select>
      </div>
      <div style="width:220px">
        <el-input
          size="small"
          v-model="search_str"
          @input="ShowingDataDetermine"
          placeholder="輸入內容查詢..."
          clearable
        >
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
    </div>

    <div class="row g-1">
      <status-card-vue
        :edge_ip="edge_ip"
        :class="column_class"
        v-for="(data,ip) in ShowingData"
        :key="ip"
        :ip="ip"
        :veData="data"
      ></status-card-vue>
    </div>
  </div>
</template>
<script>
import StatusCardVue from './StatusCard.vue';
import { configs } from '@/config';
export default {
  components: {
    StatusCardVue
  },
  data() {
    return {
      edge_ip: "",
      ws: null,
      wsConnecting: false,
      veData: {},
      ShowingData: {},
      ColsNumber: 3,
      search_str: ''
    }
  },
  computed: {
    column_class() {
      return `col-lg-${12 / this.ColsNumber}`;
    },

  },
  methods: {
    MessageDataHandle(vm) {
      this.veData = vm;
      if (this.search_str == '')
        this.ShowingData = this.veData;
    },
    WsIni() {
      this.ws = new WebSocket(`${configs.websocket_host}/VibrationEnergy?edgeIP=${this.edge_ip}`);
      this.ws.onmessage = (evt) => this.MessageDataHandle(JSON.parse(evt.data));
      this.ws.onclose = () => this.WsRetry();
    },
    WsRetry() {
      this.wsConnecting = true;
      this.WsDestory();
      this.WsIni();
    },
    WsDestory() {
      if (this.ws != null) {
        this.ws.onmessage = null;
        this.ws.onclose = null;
      }
    },
    RenderCharts() {

    },
    ShowingDataDetermine() {

      setTimeout(() => {
        if (this.search_str == '')
          return this.veData;

        var result = {};
        Object.keys(this.veData).forEach(key => {
          var ip = key.toUpperCase();
          var eq = this.veData[key].EqName.toUpperCase();
          var unit = this.veData[key].UnitName.toUpperCase();
          var _search_str = this.search_str.toUpperCase();
          if (ip.includes(_search_str) | eq.includes(_search_str) | unit.includes(_search_str)) {
            result[key] = this.veData[key];
          }
        });
        this.ShowingData = result;
      }, 500);

    }
  },
  mounted() {
    console.log('dashview mounted');
    this.WsIni();
  },
  created() {
    this.edge_ip = this.$route.params.ip
    console.log('dashview created', this.edge_ip);
  },
  unmounted() {
    this.WsDestory();
  }
}
</script>

<style>
</style>