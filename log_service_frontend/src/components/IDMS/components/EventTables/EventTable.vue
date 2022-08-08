<template>
  <el-table :data="data" stripe>
    <el-table-column label="Time" sortable fixed="left" prop="TimeStamp" :formatter="TimeFormat"></el-table-column>
    <el-table-column label="IP" prop="SensorIP"></el-table-column>
    <!-- 動態的部分 -->

    <!-- Health Score Out of threshold -->
    <el-table-column
      v-for="column in columns"
      :key="column.prop"
      :label="column.label"
      :prop="column.prop"
    >
      <template #default="scope">
        <el-tag
          effect="dark"
          v-if="column.type=='boolean'"
          :type="scope.row[column.prop]?'danger':'info'"
        >{{scope.row[column.prop]?'V':'X'}}</el-tag>
        <div v-else>{{scope.row[column.prop]}}</div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {
          SensorIP: '',
          TimeStamp: '',
          ModelName: '',
          OutOfAlarmThreshold: false,
          OutOfWarningThreshold: false,

        }
      }
    },
    columns: {
      type: Array,
      default() {
        return [
          {
            label: 'IP',
            prop: 'SensorIP'
          }
        ]
      }
    }
  },
  methods: {
    TimeFormat(_row, _column, cellValue, _index) {
      return cellValue.replace('T', ' ');
    },
    FormatHandle(row, prop) {
      //return row[prop];
      return "<el-tag>{{row[prop]}}</el-tag>"
    }
  },

}
</script>

<style>
</style>