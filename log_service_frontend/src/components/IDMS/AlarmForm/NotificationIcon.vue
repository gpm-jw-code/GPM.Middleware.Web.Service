<template>
  <div class="idms-alarm-notifi px-3 py-3">
    <el-badge :hidden="n_count==0" type="danger" :value="n_count">
      <el-button size="large" circle @click="show_form=!show_form;n_count=0">
        <el-popover trigger="hover" placement="bottom-start" :width="newest_alarm!=null?500:300">
          <template #reference>
            <el-icon size="40px" :color="n_count==0?'grey' :'red'">
              <WarningFilled />
            </el-icon>
          </template>
          <template #default>
            <div v-if="newest_alarm!=null" class="popover-content">
              <h4>最近一次警報</h4>
              <div class="d-flex flex-row">
                <span>時間</span>
                {{newest_alarm.time}}
              </div>
              <div class="d-flex flex-row">
                <span>模組IP</span>
                {{newest_alarm.deviceIP}}
              </div>
              <div class="d-flex flex-row">
                <span>EQ</span>
                {{newest_alarm.eqName}}
              </div>
              <div class="d-flex flex-row">
                <span>UNIT</span>
                {{newest_alarm.unitName}}
              </div>
              <div class="d-flex flex-row">
                <span>警報類型</span>
                {{newest_alarm.alarmType_display}}
              </div>
              <div class="d-flex flex-row">
                <span>警報描述</span>
                {{newest_alarm.alarmDescription}}
              </div>
            </div>
            <div v-else class="popover-content text-center">尚未有警報事件</div>
          </template>
        </el-popover>
      </el-button>
    </el-badge>
    <el-drawer direction="ltr" size="90%" v-model="show_form" :show-close="false">
      <!-- Header -->
      <template #header="{   titleId }">
        <div :id="titleId" class="drawer-title d-flex flex-row border-bottom">
          <div class="flex-fill text-start">
            <h4 v-text="title"></h4>
          </div>
          <div>
            <el-button icon="close" circle type="info" @click="show_form=false"></el-button>
          </div>
        </div>
      </template>
      <div class="my-0 d-flex flex-column h-100">
        <div class="flex-fill h-100">
          <AlarmTableVue @new_alarm="NewAlarmHandle" :edge_ip="edge_ip"></AlarmTableVue>
        </div>
        <!-- foot -->
        <div class="text-start px-2 border-top">
          <el-tag effect="dark" type="info">{{edge_ip}}</el-tag>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import AlarmTableVue from './AlarmTable.vue';
export default {
  components: {
    AlarmTableVue,
  },
  props: {
    edge_ip: {
      type: String,
      default: "127.0.0.1"
    },
  },
  computed: {
    popoverText() {
      return `${this.newest_alarm.time}`;
    }
  },
  data() {
    return {
      title: "Alarm Form",
      n_count: 0,
      show_form: false,
      newest_alarm: null,
      alarm_websocket: null
    }
  },
  methods: {
    NewAlarmHandle(alarm) {
      console.info(alarm);
      this.newest_alarm = alarm;
      this.n_count = this.n_count + 1;
    },
    WsIni() {
      console.info('alarm noti ws ini');
      if (this.alarm_websocket != null)
        return;
      this.alarm_websocket = new WebSocket(`ws://${this.edge_ip}:44332/AlarmForm`);
      this.alarm_websocket.onmessage = (evt) => {
        var vm = JSON.parse(evt.data);
        if (vm.currentAlarm)
          this.NewAlarmHandle(vm.currentAlarm);
      };
    },
  },
  mounted() {
  },
  unmounted() {
    this.alarm_websocket.close();
  }
}
</script>

<style>
.idms-alarm-notifi {
  position: absolute;
  right: 200px;
}
.idms-alarm-notifi .drawer-title {
  padding-top: 10px;
}
.popover-content {
  letter-spacing: 2px;
}
.popover-content div {
  margin-left: 5px;
}
.popover-content h4 {
  margin-bottom: 10px;
  text-decoration: underline;
  color: rgb(253, 0, 0);
}

.popover-content h4,
span {
  font-weight: bold;
}
.popover-content span {
  width: 70px;
}
</style>