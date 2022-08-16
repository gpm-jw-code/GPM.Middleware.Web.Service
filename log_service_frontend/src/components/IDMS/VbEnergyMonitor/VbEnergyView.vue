<template>
  <div class="fade-in bg-light">
    <div class="row g-3">
      <status-card-vue
        :edge_ip="edge_ip"
        class="col-md-4"
        v-for="(data,ip) in veData"
        :key="ip"
        :ip="ip"
        :veData="data"
      ></status-card-vue>
    </div>
  </div>
</template>
<script>
import StatusCardVue from './StatusCard.vue';
export default {
  components: {
    StatusCardVue
  },
  data() {
    return {
      edge_ip: "",
      ws: null,
      wsConnecting: false,
      veData: {}
    }
  },
  methods: {
    MessageDataHandle(vm) {
      this.veData = vm;
    },
    WsIni() {
      this.ws = new WebSocket(`ws://${this.edge_ip}:44332/VibrationEnergy`);
      this.ws.onmessage = (evt) => this.MessageDataHandle(JSON.parse(evt.data));
      this.ws.onclose = () => this.WsRetry();
    },
    WsRetry() {
      this.wsConnecting = true;
      this.WsDestory();
      this.WsIni();
    },
    WsDestory() {
      if (this.ws != null) {
        this.ws.onmessage = null;
        this.ws.onclose = null;
      }
    }
  },
  mounted() {
    this.WsIni();
  },
  created() {
    this.edge_ip = this.$route.params.ip
  }
}
</script>

<style>
</style>