<template>
  <div class="edge-status">
    <div class="title d-flex flex-column px-1 w-100">
      <h3>{{EdgeProp.Name}}</h3>
      <span>{{EdgeProp.EdgeIP}}</span>
    </div>
    <el-progress type="circle" :percentage="100" :width="circleWidth" status="primary">
      <div class="sensor-num-div">
        <div class="sensor-num">{{EdgeProp.SensorNum}}</div>
        <div>感測器數量</div>
      </div>
    </el-progress>
    <el-progress
      type="circle"
      :percentage="100"
      :width="circleWidth"
      :status="EdgeProp.Status=='Offline'? 'exception':'success'"
    >
      <div class="sensor-num-div">
        <div class="sensor-num" v-bind:class="EdgeProp.Status+''">{{EdgeProp.Status}}</div>
        <div>狀態</div>
      </div>
    </el-progress>
    <div class="my-2">
      <b-button class="bg-primary w-100" @click="EnterEdgeHandle">Enter</b-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    EdgeProp: {
      type: Object,
      default() {
        return {
          Name: 'Line-2',
          EdgeIP: "127.0.0.1",
          SensorNum: 10,
          Status: 'Offline'
        }
      }
    },
  },
  data() {
    return {
      circleWidth: 140
    }
  },
  methods: {
    EnterEdgeHandle() {
      localStorage.setItem('edgeip', this.EdgeProp.EdgeIP);
      document.getElementById('breadcrumb').style['visibility'] = 'visible';
      this.$router.push(`/EdgeMain/${this.EdgeProp.EdgeIP}`);
      //   this.$router.push(`/EdgeMain`);
    }
  }
}
</script>

<style>
.edge-status h3 {
  letter-spacing: 0.21rem;
}
.edge-status span {
  letter-spacing: 0.11rem;
  padding-top: 2px;
}
.edge-status .title {
  text-align: left;
}

.sensor-num-div {
  color: grey;
}
.sensor-num {
  font-size: 38px;
}
.Offline {
  color: red;
}

.Online {
  color: green;
}
</style>