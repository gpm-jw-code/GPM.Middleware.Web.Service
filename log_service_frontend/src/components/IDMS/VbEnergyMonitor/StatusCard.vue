<template>
  <div class="ve-module-status d-flex flex-column px-1 py-1">
    <div class="bg-dark">
      <!-- 狀態TITLE -->
      <div class="info d-flex flex-row px-2 py-2">
        <div class="flex-fill d-flex justify-content-start">
          <span>EQ :</span>
          <span>{{veData.EqName}}</span>
          <span>UNIT :</span>
          <span>{{veData.UnitName}}</span>
        </div>
        <div class>
          <span>{{ip}}</span>
          <el-icon size="18px">
            <CircleCheck v-if="Connected"></CircleCheck>
            <Warning v-else></Warning>
          </el-icon>
        </div>
      </div>
      <!-- 三軸監控狀態ICON -->
      <div class="d-flex flex-row justify-content-center py-2">
        <div class="axis-status" v-for="(obj,axis) in veData.AxisStatus" :key="axis">
          <span>{{axis}}</span>
          <div class="icon" v-bind:class="obj.IsOutOfSPC? 've-warning':'ve-normal'">
            <el-icon>
              <CircleCheckFilled v-if="!obj.IsOutOfSPC"></CircleCheckFilled>
              <WarningFilled v-else></WarningFilled>
            </el-icon>
            <span class="ve-value">{{obj.veValue.toFixed(3)}}</span>
          </div>
        </div>
      </div>
      <!-- ENTER Button -->
      <div>
        <b-button @click="EnterHandle" class="w-100" variant="dark">ENTER</b-button>
      </div>
      <DetailViewVue ref="detail_view" :edge_ip="edge_ip" :ip="ip"></DetailViewVue>
    </div>
  </div>
</template>
<script>
import DetailViewVue from './DetailView.vue';

export default {
  components: {
    DetailViewVue
  },
  props: {
    edge_ip: {
      type: String,
      default: '127.0.0.1'
    },
    ip: {
      type: String,
      default: '123.213.213.23'
    },
    veData: {
      type: Object,
      default() {
        return {
          IP: "",
          EqName: "",
          UnitName: "",
          AxisStatus: {
            X: {
              status: 'normal'
            },
            Y: {
              status: 'warning'
            },
            Z: {
              status: 'danger'
            }
          }
        }
      }
    }
  },
  data() {
    return {
      Connected: true,
    }
  },
  methods: {
    EnterHandle() {
      this.$refs['detail_view'].Show();
    }
  }
}
</script>

<style >
.ve-module-status {
  border: 1px solid black;
  border-radius: 8px;
  box-shadow: -2px 1px 12px 3px rgb(15, 15, 15);
}
.axis-status {
  width: 120px;
  height: 120px;
  padding: 0;
  flex-direction: column;
  justify-content: center;
  display: flex;
}

.axis-status .ve-value {
  position: absolute;
}

.axis-status span {
  font-size: large;
  color: white;
  padding-top: 30px;
}
.axis-status div {
  padding: 0;
  margin: 0 auto;
  font-size: 54px;
}
.axis-status .icon {
  /* box-shadow: 10px 10px 10px 10px black; */
  padding-top: 5px;
}
.axis-status:hover {
  background-color: rgb(33, 53, 70);
  cursor: pointer;
}

.info {
  color: white;
  border-block-end: 2px solid grey;
}
.ve-normal {
  color: rgb(72, 215, 136);
}
.ve-warning {
  color: orange;
}
.ve-danger {
  color: red;
}
</style>