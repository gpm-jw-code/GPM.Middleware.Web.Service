<template>
  <div class="network-status">
    <el-tooltip class="box-item" effect="dark" :content="`${ping} ms`" :placement="toolTipPosition">
      <el-button
        @click="Click"
        class="my-s"
        size="small"
        round
        v-bind:style="[style]"
        :type=" success? 'success': 'danger'"
      >{{displayPingTime? ping+"ms":''}}</el-button>
    </el-tooltip>
  </div>
</template>

<script>
import { configs } from '@/config';
export default {
  props: {
    ip: {
      type: String,
      default: "127.0.0.1"
    },
    successColor: {
      type: String,
      default: '#92cf35'
    },
    failColor: {
      type: String,
      default: 'rgb(211, 40, 40)'
    },
    toolTipPosition: {
      type: String,
      default: "right"
    },
    host_route: {
      type: String,
      default: `${configs.websocket_host}/ping-ip`
    }
  },
  data() {
    return {
      success: false,
      ping: -1,
      displayPingTime: false,
      websocket: null
    }
  },
  computed: {
    style() {
      return {
        backgroundColor: this.success ? this.successColor : this.failColor,
        width: this.displayPingTime ? '60px' : 'auto',
        boxShadow: `2px -2px 12px 0.001rem ${this.success ? this.successColor : this.failColor}`,
        // border: '1px solid grey'
      }
    }
  },
  methods: {
    Click() {
      this.displayPingTime = !this.displayPingTime;
    }
  },
  mounted() {
    this.websocket = new WebSocket(this.host_route + `?ip=${this.ip}`);
    this.websocket.onerror = () => { };
    this.websocket.onmessage = (evt) => {
      var object = JSON.parse(evt.data)
      this.success = object.Success;
      this.ping = object.PingTime;
    }

  },
  unmounted() {
    this.websocket.onerror = null;
    this.websocket.onmessage = null;
    this.websocket.close();
  }
}
</script>

<style scoped>
.network-status {
  margin: 5px;
}
.my-s {
  color: white;
  font-size: 9px;
  animation: te infinite;
  -webkit-animation: te infinite;
  animation-duration: 2000ms;
  animation-play-state: running;
  box-shadow: 2px -2px 12px 0.001rem black;
}

.my-s:active {
  -webkit-animation: flip;
  animation: flip;
  animation-duration: 500ms;
}
@keyframes te {
  0% {
    opacity: 0.6;
  }
  20% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  80% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.6;
  }
}

@keyframes flip {
  to {
    transform: rotateX(180deg);
  }
}
</style>