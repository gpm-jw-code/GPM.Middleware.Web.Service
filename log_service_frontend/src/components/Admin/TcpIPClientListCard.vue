<template >
  <div class="col-lg card" style="width:100%;">
    <div class="card-body">
      <h5 class="card-title">TCP/IP CLIENT ({{tcpClientState.length}})</h5>
      <el-divider></el-divider>
      <div class="justify-content-center">
        <el-table :data="tcpClientState" height="300px" empty-text="NO  CONNECTED">
          <el-table-column prop="endPoint" label="EndPoint"></el-table-column>
          <el-table-column prop="connectedTime" label="Connect Time"></el-table-column>
          <el-table-column prop="lastRequestTime" label="Last Request Time"></el-table-column>
          <el-table-column prop="lastRequestCmd" label="Last Request"></el-table-column>
          <el-table-column prop="lastRequestCmd" label="Last Response"></el-table-column>
          <el-table-column fixed="right">
            <template #default="scope">
              <div>
                <el-button type="danger" @click="RemoveBtnHandle(scope.row.endPoint)">REMOVE</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="card-text">
        <div
          v-for="tcpClient in tcpClientState"
          :key="tcpClient.endPoint"
        >{{tcpClient.endPoint}} / {{tcpClient.idlingTime}}</div>
      </div>-->
    </div>
  </div>
</template>
<script>
import { KickTcpClinetOut } from "../../APIHelpers/BackendAPIs"
export default {
  props: {
    tcpClientState: {
      type: Array,
      default() {
        return []
      }
    },
  },
  data() {
    return {
      checkEx2Selected: ['A'],
      checkEx2Options: [
        { item: 'A', name: 'Option A' },
      ]
    }
  },
  methods: {
    async RemoveBtnHandle(e) {
      await KickTcpClinetOut(e);
    },
    req_res_text_format(cellValue = "", index = 0) {
      console.info(cellValue, index);
      return cellValue;
    }
  }
}
</script>
<style >
</style>