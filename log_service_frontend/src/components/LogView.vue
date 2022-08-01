<template>
  <div id="LOG-VIEW" style="padding-top:80px">
    <h1>LOG</h1>
    <div>
      <div class="head-row">
        <b-row>
          <b-col cols="3">
            <div>Time</div>
          </b-col>
          <b-col class="from" cols="1">
            <div>From</div>
          </b-col>
          <b-col cols="8">
            <div class="msgContent">Log Context</div>
          </b-col>
        </b-row>
      </div>
      <div class="row-container">
        <div v-for="msg in recievedMsgListReversed" :key="msg.Time" class="log-view">
          <b-row>
            <b-col cols="3">
              <div>{{msg.Time}}</div>
            </b-col>
            <b-col class="from" cols="1">
              <div>{{msg.From}}</div>
            </b-col>
            <b-col cols="8">
              <div class="msgContent">{{msg.Message}}</div>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  components: {},
  name: 'LogView',
  props: {
    msg: String
  },
  data() {
    return {
      ws: null,
      logmessRev: "",
      recievedMsgList: [],

    }
  },
  methods: {
    WSConnect() {
      var host = process.env.NODE_ENV === 'development'
        ? 'https://172.17.0.67:8001'
        : window.location.protocol + '//' + window.location.host;
      var wsHost = host.replace("http", "ws");
      var ws = new WebSocket(`${wsHost}/client`);

      ws.onopen = () => this.OnOpenHandle(ws);
      ws.onerror = () => {
        console.info('ws disconnect...ping mess send fail');
        this.WSConnect();
      }
      ws.onmessage = (ws) => {
        this.OnMessageHandle(ws.data)
      };
    },
    OnOpenHandle(ws = WebSocket) {
      console.info('log ws connected')
      this.ws = ws;
      var ti = setInterval(() => {
        try {
          ws.send("123");
        } catch (error) {
          clearInterval(ti);
          console.info("disconnected");
          this.WSConnect();
        }
      }, 1000);
    },
    OnMessageHandle(data) {
      var msgState = JSON.parse(data);
      console.info(msgState.logs);
      if (msgState.msgType == 1) {
        this.recievedMsgList = [];
      }

      for (let index = 0; index < msgState.logs.length; index++) {
        const log = msgState.logs[index];
        log.Time = moment(log.Time).format("yyyy/MM/DD HH:mm:ss");
        this.recievedMsgList.push(log);
        if (this.recievedMsgList.length > 20) {
          this.recievedMsgList.splice(0, 1);
        }
      }
    },

    OnCloseHandle() {
      console.info('closed');
    },
    TryGetHistoryLogFromLocalStorage() {
      var hisJson = localStorage.getItem('logCaches');
      if (hisJson) {
        this.recievedMsgList = JSON.parse(hisJson);
      }
    }
  },
  computed: {
    recievedMsgListReversed() {
      var reversedAry = [];
      var len = this.recievedMsgList.length;
      for (let index = len - 1; index > 0; index--) {
        reversedAry.push(this.recievedMsgList[index]);
      }
      return reversedAry;
    }
  },
  mounted() {
    // this.TryGetHistoryLogFromLocalStorage();
    this.WSConnect();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
#LOG-VIEW {
  padding: 10px 120px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.head-row {
  background-color: gray;
  color: white;
  font-size: 25px;
  border: 1px solid black;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.row-container {
  border-end-start-radius: 10px;
  border-end-end-radius: 10px;
  border: 1px solid black;
}
.msgContent {
  text-align: left;
  padding-left: 20px;
}

.log-view {
  background-color: black;
  color: white;
  margin: auto 0;
  padding: 10px;
  width: 100%;
  border: 2px solid grey;
}

.log-view .from {
  background-color: red;
  color: white;
  border-radius: 30px;
}

.log-view:hover {
  background-color: white;
  color: black;
  cursor: pointer;
}
</style>
