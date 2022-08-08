<template>
  <div v-loading="loading">
    <el-pagination
      layout="prev, pager, next"
      v-model="page"
      background
      :total="totalNum"
      :page-size="15"
      @current-change="ChangePage"
    />
    <EventTableVue :data="dataRet" :columns="columns"></EventTableVue>
  </div>
</template>

<script>
import { EventQuery } from '@/APIHelpers/DatabaseServerAPI'
import EventTableVue from './EventTables/EventTable.vue';
export default {
  components: {
    EventTableVue,
  },
  props: {
    ip: {
      type: String,
      default: '123'
    },
    from: {
      type: Date,
      default: Date.now
    },
    to: {
      type: Date,
      default: Date.now
    },
    queryItem: {
      type: String,
      default: ''
    },
    eventItem: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      dataRet: null,
      totalNum: 1,
      page: 1,
      columns: [{
        label: 'IP',
        prop: 'SensorIP'
      }],
    }
  },

  methods: {
    QueryHandle(page = 1) {

      if (page == 1) {

        this.totalNum = 0;
        this.page = 1;
        this.dataRet = [];
      }

      this.loading = true;
      console.log(this.queryItem, this.eventItem);
      if (this.queryItem == 'Health Score') {
        if (this.eventItem == 'Out Of Threshold')
          EventQuery.HealthScoreOutOfThreshold(this.ip, this.from, this.to, page).then(res => { this.RenderTable(res); }).catch(er => {
            console.info('八逼Q');
          });

      }

      if (this.queryItem == 'Sideband Severity') {
        if (this.eventItem == 'Out Of Threshold')
          EventQuery.SideBandSeverityOutOfThres(this.ip, this.from, this.to, page).then(res => { this.RenderTable(res); });
      }


      setTimeout(() => {
        this.loading = false;
      }, 200);

    },
    ChangePage(page) {
      console.info(page)
      this.QueryHandle(page);
    },
    RenderTable(res) {
      this.columns = res.ElTableColumns;
      console.log(res)

      if (res.message) {
        console.info('八逼Q了');
        return;
      }

      if (res.TotalNum != 0) {
        this.totalNum = res.TotalNum;
        this.page = res.Page;
        this.dataRet = res.Data;
      }
      else {
        this.totalNum = 0;
        this.page = 1;
        this.dataRet = [];
      }
    }
  },

}
</script>

<style>
</style>