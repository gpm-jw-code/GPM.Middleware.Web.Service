<template>
  <div class="d-flex flex-column h-100 padding">
    <div class="bg-light">
      <div v-if="userNameInput==undefined" class="flex-fill">
        <div class="input-info">
          <b-form-input v-model="user_input_name" type="text" placeholder="Enter your name"></b-form-input>
          <b-button class="w-100" variant="primary" @click="EnterRoomHandle">Enter</b-button>
        </div>
      </div>
      <div v-else class="bg-dark" id="messages-content" v-bind:style="msg_container_style">
        <div v-for="msgObj in allMsgObjList" :key="msgObj.time">
          <div class="system-message" v-if="msgObj.isInfoMessage">{{msgObj.message}}</div>
          <div
            v-else
            v-bind:class="msgObj.dir=='rev'? 'rev-message d-flex flow-row justify-content-start':'send-message d-flex flow-row justify-content-end'"
            :key="msgObj.time"
          >
            <div class="d-flex flex-column">
              <div class="sender w-100">{{msgObj.from}}</div>
              <div v-if="msgObj.dir=='rev'" class="d-flex flex-row">
                <div class="msg">{{msgObj.message}}</div>
                <div class="time">{{msgObj.time}}</div>
              </div>
              <div v-else class="d-flex flex-row">
                <div class="time">{{msgObj.time}}</div>
                <div class="msg">{{msgObj.message}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-show="Unread && roomEntered"
        style="height:50px;bottom:50px;background-color: black; opacity: .6;"
      >未讀訊息>></div>
      <div v-show="roomEntered" class="bg-light padding w-100" style="height:50px ;bottom:0">
        <div class="d-flex flex-row">
          <div>
            <b-button id="sendButton" variant="danger">離開</b-button>
          </div>
          <div class="flex-fill">
            <b-form-input v-model="messageInput" @keydown.enter="SendMessageHandle" type="text"></b-form-input>
          </div>
          <div>
            <b-button id="sendButton" :disable="messageInput==''" @click="SendMessageHandle">Send</b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { configs } from '@/config';
import { FLOWBASEANNOTATION_TYPES } from '@babel/types';
import moment from 'moment'
export default {
  data() {
    return {
      userNameInput: undefined,
      user_input_name: "",
      roomEntered: false,
      Unread: false,
      messageInput: '',
      ws: null,
      revObjList: [],
      sendObjList: [], allMsgObjList: []
    }
  },
  computed: {
    msg_container_style() {
      return { height: `${(window.innerHeight - 100)}px` }
    }
  },
  methods: {
    EnterRoomHandle() {
      this.userNameInput = this.user_input_name == '' ? 'anonymous-' + Date.now() : this.user_input_name;
      this.ws = new WebSocket(`${configs.websocket_host}/chat?name=${this.userNameInput}`);
      this.ws.onmessage = (event) => {
        var msgObj = JSON.parse(event.data);
        msgObj.dir = 'rev';
        this.allMsgObjList.push(msgObj);
        this.ScrollToBottom();

        this.$emit('msgOnRecieved', {});

      }
      this.ws.onopen = () => {
        this.roomEntered = true;
      }
    },
    SendMessageHandle() {
      if (this.messageInput == '')
        return;
      let sendObj = { message: this.messageInput, name: this.userNameInput, from: 'You', time: moment(Date.now()).format('yyyy/MM/DD HH:mm:ss') }
      this.ws.send(this.messageInput);
      this.ScrollToBottom();
      sendObj.dir = 'send';
      this.allMsgObjList.push(sendObj);
      this.messageInput = '';
    },
    ScrollToBottom() {
      var element = document.getElementById("messages-content");
      element.scrollTop = element.scrollHeight;
      console.info(element.scrollTop);
    },
    ShowUnReadIndicator() {
      var element = document.getElementById("messages-content");
      if (element) {
        console.info(element);
        console.info(element.scrollTop, element.scrollHeight);
        this.Unread = element.scrollTop != element.scrollHeight
      }
      else
        this.Unread = false;
    }
  },
  mounted() {

  }
}
</script>

<style>
.input-info {
  margin: 0 auto;
  padding: 20% 0;
  width: 400px;
}

#messages-content {
  overflow-y: scroll;
  padding: 30px 10px;
  border-radius: 3px;
}

.send-message,
.rev-message {
  width: 100%;
}

.rev-message .msg {
  background-color: brown;
}

.send-message .msg {
  background-color: rgb(34, 110, 15);
}
#messages-content .system-message {
  background-color: rgb(48, 48, 48);
  color: rgb(177, 177, 177);
  padding: 10px;
}
#messages-content .msg {
  padding: 10px;
  border-radius: 13px;
  margin: 5px 10px;
  color: white;
}

#messages-content .time {
  padding-top: 28px;
  font-size: 9px;
  color: grey;
}

#messages-content .sender {
  color: white;
}

.rev-message .sender {
  text-align: left;
  padding-left: 10px;
}

.send-message .sender {
  text-align: right;
  padding-right: 10px;
}

.padding {
  padding: auto 100px;
}
</style>