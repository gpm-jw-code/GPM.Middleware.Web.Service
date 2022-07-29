<template>
  <div style="padding-top:75px">
    <el-table stripe :data="ModuleStatesData">
      <el-table-column width="44" fixed>
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
      <el-table-column prop="IP" label="IP" sortable fixed>
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
</template>

<script>
import { configs } from '@/config';
export default {
  data() {
    return {
      ModuleStatesData: [],
      ws: null //websocket to do data handshake...
    }
  },
  mounted() {
    this.WebSocketInitial();
  },
  methods: {
    WebSocketInitial() {
      this.ws = new WebSocket(`${configs.idms_websocket_host}/ModuleStates`);
      this.ws.onmessage = (_ws) => {
        this.ModuleStatesData = JSON.parse(_ws.data);
      }
      this.ws.onclose = () => {
        this.WebSocketInitial();
      }
    }
  }
}
</script>

<style  scoped>
</style>