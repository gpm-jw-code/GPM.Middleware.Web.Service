<template>
  <div class="dignose-list-view px-2">
    <el-table
      :default-sort="{ prop: 'IP', order: 'descending' }"
      height="600"
      :data="DignoseDatas"
      v-loading="loading"
    >
      <el-table-column sortable prop="IP" label="IP"></el-table-column>
      <el-table-column sortable prop="EqName" label="EQ Name"></el-table-column>
      <el-table-column sortable prop="UnitName" label="Unit Name"></el-table-column>
      <el-table-column sortable prop="HealthScore" label="Health Score"></el-table-column>
      <el-table-column sortable prop="AlertIndex" label="Alert Index"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ws: {
        type: WebSocket
      },
      loading: true,
      DignoseDatas: []
    }
  },
  mounted() {
    this.ws = new WebSocket("ws://192.168.0.201:44332/Dignose?type=list");
    this.ws.onopen = () => { }
    this.ws.onmessage = (_ws) => {
      this.loading = false;
      this.DignoseDatas = JSON.parse(_ws.data);
    }
  },
  unmounted() {
    this.ws.close();
  }
}
</script>

<style lang="scss" scoped>
$bgColor: rgb(255, 255, 255);

.dignose-list-view {
  h4 {
    color: pink;
  }
}

.test {
  background-color: black;
}
</style>