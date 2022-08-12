<template>
  <div class="fade-in">
    <div class="px-2 py-2 w-100 d-flex flex-row justify-content-start">
      <el-radio-group v-model="mode">
        <el-radio-button size="small" label="Network"></el-radio-button>
        <el-radio-button size="small" label="Module"></el-radio-button>
      </el-radio-group>
    </div>
    <el-divider></el-divider>
    <div v-if="mode=='Network' " class="w-100 d-flex flex-column justify-content-center">
      <h3>Network State</h3>
      <el-divider></el-divider>
      <div class="w-100 ping-container">
        <div class="module-ping mx-1 my-1" v-for="module in ModuleStatesData" :key="module.IP">
          <a :href="'http://'+module.IP" v-text="module.IP" />
          <div>{{module.EqName}}</div>
          <div>{{module.UnitName}}</div>
          <div class="my-3">
            <NetworkStatusVue size="large" :ip="module.IP"></NetworkStatusVue>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mode=='Module'">
      <h3>Module State</h3>
      <el-divider></el-divider>
      <el-table stripe :data="ModuleStatesData" row-key="IP">
        <el-table-column width="44" fixed="left">
          <template #default="scope">
            <el-icon
              v-show=" (!scope.row.ControllerAbnormal && scope.row.SensorAbnormal) | (scope.row.ControllerAbnormal && !scope.row.SensorAbnormal)"
              color="gold"
              :size="30"
            >
              <WarningFilled />
            </el-icon>
            <el-icon
              v-show="scope.row.ControllerAbnormal && scope.row.SensorAbnormal"
              color="red"
              :size="30"
            >
              <WarningFilled />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="IP" label="IP" sortable fixed="left">
          <template #default="scope">
            <a :href="'http://'+scope.row.IP" target="popup">{{scope.row.IP}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="EqName" label="EQ Name" sortable></el-table-column>
        <el-table-column prop="UnitName" label="UNIT Name" sortable></el-table-column>
        <el-table-column prop="ControllerAbnormal" label="控制器狀態">
          <template #default="scope">
            <el-tag
              style="width:100px"
              :type="scope.row.ControllerAbnormal ? 'danger' : 'success'"
              disable-transitions
              effect="dark"
            >{{ scope.row.ControllerAbnormal?'異常':'正常' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="SensorAbnormal" label="感測器狀態">
          <template #default="scope">
            <el-tag
              style="width:100px"
              :type="scope.row.SensorAbnormal ? 'danger' : 'success'"
              disable-transitions
              effect="dark"
            >{{ scope.row.SensorAbnormal?'異常':'正常' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { configs } from '@/config';
import NetworkStatusVue from '@/components/IDMS/components/NetworkStatus.vue';

export default {
  components: { NetworkStatusVue },
  data() {
    return {
      mode: 'Module',
      ModuleStatesData: [],
      ws: null,//websocket to do data handshake...
      EdgeIP: '127.0.0.1'
    }
  },
  mounted() {
    this.WebSocketInitial();
  },
  methods: {
    WebSocketInitial() {
      this.ws = new WebSocket(`ws://${this.EdgeIP}:44332/ModuleStates`);
      this.ws.onmessage = (_ws) => {
        this.ModuleStatesData = JSON.parse(_ws.data);
      }
      this.ws.onclose = () => {
        this.WebSocketInitial();
      }
    }
  },
  created() {
    console.info('fssssff', this.$route.params.ip)
    this.EdgeIP = this.$route.params.ip;
  }
}
</script>

<style  scoped>
.ping-container {
  padding-left: 40px;
}

.module-ping {
  float: left;
  width: 220px;
  height: 180px;
  border: 1px dashed grey;
  border-radius: 6px;
}
.module-ping div {
  height: 20px;
  margin: 3px;
}

@media screen and (max-width: 550px) {
  .module-ping {
    width: 100%;
  }
  .ping-container {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>