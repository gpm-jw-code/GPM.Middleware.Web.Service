<template >
  <div class="col-lg card" style="width:100%;">
    <div class="card-body">
      <h5 class="card-title">TCP/IP SERVER</h5>
      <el-divider></el-divider>
      <div class="row w-100 g-1 d-flex justify-content-start">
        <!-- SERVER -->
        <div class="col-lg-4 g-1 justify-content-center bg-light">
          <div class="py-3">
            <u>
              <b>SERVER STATE</b>
            </u>
          </div>
          <div>
            <div class="row">
              <div class="col-lg-6">HOST:</div>
              <div class="col-lg-6">{{tcpServerState.host}}</div>
            </div>
            <div class="row">
              <div class="col-lg-6">STATUS:</div>
              <div class="col-lg-6">
                <el-tag effect="dark" type="success" size="large">{{tcpServerState.state}}</el-tag>
              </div>
            </div>
          </div>
        </div>
        <!-- CLIENT -->
        <div class="col-lg-8 bg-light">
          <div class="w-100 py-3">
            <u>
              <b class>CLIENTS</b>
            </u>
          </div>
          <el-table
            row-key="endPoint"
            :data="tcpClientState"
            height="300px"
            empty-text="NO  CONNECTED"
            highlight-current-row
          >
            <el-table-column prop="endPoint" label="EndPoint"></el-table-column>
            <el-table-column prop="connectedTime" label="Connect Time"></el-table-column>
            <el-table-column prop="lastRequestTime" label="Last Request Time"></el-table-column>
            <!-- <el-table-column type="expand" prop="lastRequestCmd" label="Last Request"></el-table-column> -->
            <el-table-column width="100" fixed="right">
              <template #default="scope">
                <div>
                  <el-button type="danger" @click="RemoveBtnHandle(scope.row.endPoint)">REMOVE</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column type="expand" fixed="right">
              <template #default="scope">
                <div class="bg-dark">
                  <div>最近一次接收:{{scope.row.lastRequestCmd}}</div>
                  <div>最近一次回覆:{{scope.row.lastRequestCmd}}</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
    tcpServerState: {
      type: Object,
      default() {
        return {
          host: '0.0.0.0:00',
          state: 'Listening'
        }
      }
    }
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