<template>
  <div class="h-100" style="margin-top:-20px">
    <div class="mode-selector">
      <el-radio-group class="w-100" v-model="mode">
        <el-radio-button label="Real Time"></el-radio-button>
        <el-radio-button label="Query "></el-radio-button>
      </el-radio-group>
    </div>
    <!-- 即時 -->
    <div class="h-100" v-if="mode=='Real Time'" v-loading="rt_table_loading">
      <div class="w-100 d-flex flex-row border-bottom py-3" style="height:80px">
        <div class="newest-alarm-info row w-100">
          <h4 class="col-md-2">
            <i class="bi bi-exclamation-triangle-fill"></i> 最近一次警報
          </h4>
          <div class="col-md-10 text-start" v-if="RecentAlarm">
            <el-tag size="large" effect="dark" type="danger">{{ RecentAlarm.time}}</el-tag>
            <el-tag
              size="large"
              effect="dark"
              type="info"
            >{{RecentAlarm.eqName}}/{{RecentAlarm.unitName}}({{RecentAlarm.deviceIP}})</el-tag>
            <!-- <el-tag effect="dark" type="info">{{ RecentAlarm.eqName}}</el-tag>
            <el-tag effect="dark" type="info">{{ RecentAlarm.unitName}}</el-tag>-->
            <el-tag size="large" effect="dark" type="warning">{{ RecentAlarm.alarmType_display}}</el-tag>
            <!-- <el-tag size="large" effect="dark" type="danger">{{ RecentAlarm.alarmDescription}}</el-tag> -->
          </div>
          <div v-else>(EMPTY)</div>
        </div>
        <div class="text-end my-2 flex-fill">
          <b-button variant="danger" size="md">Clear</b-button>
        </div>
      </div>
      <div class="w-100">
        <el-pagination
          layout="prev, pager, next"
          v-model="currentPage"
          :page-size="alarmViewModel.itemNumInPage"
          :page-count="alarmViewModel.totalPage"
          @current-change="PageChangeHandle"
        />
      </div>

      <el-table
        table-layout="auto"
        border
        stripe
        :data="alarms"
        empty-text="尚未有警報"
        row-key="time"
        height="85%"
        style="; width: 100%"
      >
        <el-table-column
          :formatter="ColumnValueFormat"
          v-for="column in columnProps"
          :key="column.prop"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :fixed="column.fixed"
          sortable
        >
          <template #default="scope">
            <el-tag
              style="width:110px"
              effect="dark"
              type="warning"
              v-if="column.prop=='alarmType_display'"
            >{{scope.row[column.prop]}}</el-tag>
            <div v-else>{{scope.row[column.prop]}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 查詢 -->
    <div v-else v-loading="query_table_loading">
      <div class="w-100 d-flex flex-row border-bottom py-3" style="height:80px">
        <div class="d-flex flex-row text-start">
          <span class="mx-3">Form</span>
          <b-form-input type="date" v-model="queryOptions.from_date"></b-form-input>
          <b-form-input type="time" v-model="queryOptions.from_time"></b-form-input>
          <span class="mx-3">To</span>
          <b-form-input type="date" v-model="queryOptions.to_date"></b-form-input>
          <b-form-input type="time" v-model="queryOptions.to_time"></b-form-input>
          <b-button @click="QueryHandle" variant="primary" size="md" style="width:300px">查詢</b-button>
        </div>
      </div>
      <div class="w-100">
        <el-pagination
          layout="prev, pager, next"
          v-model="currentPage_Query"
          :page-size="alarmViewModel_Query.itemNumInPage"
          :page-count="alarmViewModel_Query.totalPage"
          @current-change="PageChangeHandle_Query"
        />
      </div>
      <el-table
        border
        stripe
        table-layout="auto"
        :data="alarms_query_in_currentPage"
        empty-text="Empty-Result"
        row-key="time"
      >
        <el-table-column
          :formatter="ColumnValueFormat"
          v-for="column in columnProps"
          :key="column.prop"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :fixed="column.fixed"
        >
          <template #default="scope">
            <el-tag
              style="width:110px"
              effect="dark"
              type="warning"
              v-if="column.prop=='alarmType_display'"
            >{{scope.row[column.prop]}}</el-tag>
            <div v-else>{{scope.row[column.prop]}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { watch } from 'vue';
import moment from 'moment';

export default {
  props: {
    edge_ip: {
      type: String,
      default: null,
      alarm_websocket: null
    },
  },
  data() {
    return {
      rt_table_loading: true,
      query_table_loading: false,
      columnProps: [
        { prop: 'time', label: '時間', fixed: 'left' },
        { prop: 'deviceIP', label: 'Sensor IP' },
        { prop: 'eqName', label: 'EQ' },
        { prop: 'unitName', label: 'UNIT' },
        { prop: 'alarmType_display', label: '事件類型' },
        { prop: 'alarmDescription', label: 'Comment', fixed: 'right' }
      ],
      alarmViewModel: {
        totalAlarm: -1,
        totalPage: 0,
        itemNumInPage: 15,
        currentAlarm: null,
        topAlarms: []
      },
      alarmViewModel_Query: {
        totalAlarm: -1,
        totalPage: 0,
        itemNumInPage: 15,
        currentAlarm: {},
        topAlarms: []
      },
      alarms: [
      ],
      mode: 'Real Time',
      currentPage: 1,
      currentPage_Query: 1,
      alarms_query: [],
      alarms_query_in_currentPage: [],
      queryOptions: {
        from_date: "2022-08-18",
        from_time: "13:00",
        to_date: "2022-08-18",
        to_time: "15:10",
      }
    }
  },
  computed: {
    queryFrom() {
      return `${this.queryOptions.from_date} ${this.queryOptions.from_time}`;
    },
    queryTo() {
      return `${this.queryOptions.to_date} ${this.queryOptions.to_time}`;
    },
    RecentAlarm() {
      var recentAlarm = this.alarmViewModel.topAlarms.length != 0 ? this.alarmViewModel.topAlarms[0] : null;
      if (recentAlarm) {
        recentAlarm.time = moment(recentAlarm.time).format('yyyy-MM-DD HH:mm:ss');
      }
      return recentAlarm;
    }
  },
  mounted() {
    console.info('alarm-table mounted', this.edge_ip);
    this.WsIni();
    watch(() => this.edge_ip, (newIP, oldIP) => {
      console.info('alarm-table', newIP, oldIP);
    })
  },
  methods: {
    WsIni() {
      this.alarm_websocket = new WebSocket(`ws://${this.edge_ip}:44332/AlarmForm`);
      this.alarm_websocket.onmessage = (evt) => this.WsDataHandle(JSON.parse(evt.data));
    },
    WsDataHandle(alarmViewModel) {

      this.alarmViewModel = alarmViewModel;
      let currentAlarm = this.alarmViewModel.currentAlarm;
      //使用者在第一頁的時候才更新，因為他在瀏覽別頁你還更新的話會很靠北  
      if (this.currentPage == 1) {
        this.alarms = this.alarmViewModel.topAlarms;
      }
      this.rt_table_loading = false;
    },
    PageChangeHandle(page) {

      this.rt_table_loading = true;
      console.info(page);
      this.currentPage = page;
      var ws = new WebSocket(`ws://${this.edge_ip}:44332/AlarmForm/Query?page=${page}`);
      ws.onmessage = (evt) => {
        this.alarms = JSON.parse(evt.data);
        this.rt_table_loading = false;
      }
    },
    QueryHandle() {
      this.query_table_loading = true;

      var ws = new WebSocket(`ws://${this.edge_ip}:44332/AlarmForm/Query?from=${this.queryFrom}&to=${this.queryTo}`);
      ws.onmessage = (evt) => {
        this.alarmViewModel_Query = JSON.parse(evt.data);
        console.info(this.alarmViewModel_Query);
        this.currentPage_Query = 1;
        this.alarms_query_in_currentPage = this.TakeQueryAlarm(1);
        this.query_table_loading = false;
      }
    },
    TakeQueryAlarm(page = 1) {
      var queryAlarms = this.alarmViewModel_Query.topAlarms;
      var page_item_size = this.alarmViewModel_Query.itemNumInPage;
      var formIndex = page_item_size * (page - 1);
      console.info(page_item_size, formIndex);
      return queryAlarms.slice(formIndex, formIndex + page_item_size)
    },
    PageChangeHandle_Query(page) {
      this.currentPage_Query = page;
      this.alarms_query_in_currentPage = this.TakeQueryAlarm(page);
    },
    ColumnValueFormat(row, column, cellValue, index) {
      if (column.property == 'time')
        return moment(cellValue).format('yyyy-MM-DD HH:mm:ss');
      return cellValue;
    }
  }
}
</script>

<style>
.mode-selector {
  position: absolute;
  top: 29px;
  right: 70px;
}

.newest-alarm-info {
}

.newest-alarm-info h4 {
  color: red;
  font-weight: bolder;
  text-shadow: 22px 2px 10px 2px rgb(136, 136, 136);
}

.newest-alarm-info span {
  letter-spacing: 1px;
}
</style> 