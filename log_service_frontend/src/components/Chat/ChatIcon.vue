<template>
  <div class="chat-icon">
    <el-badge :value="unReadMsgNum" :hidden="unReadMsgNum==0">
      <el-button size="large" circle @click="ChatIconClickHandle">
        <el-icon>
          <ChatSquare />
        </el-icon>
      </el-button>
    </el-badge>
    <el-drawer direction="rtl" :size="drawer_size" v-model="show_chat_room" title="Chat Room">
      <div style="position: absolute;right: 12px;left: 12px;top: 53px;">
        <ChatingViewVue ref="chat_room" @msgOnRecieved="MsgRevHandle"></ChatingViewVue>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import ChatingViewVue from '@/views/ChatingView.vue';
export default {
  components: {
    ChatingViewVue,
  },
  data() {
    return {
      show_chat_room: false,
      unReadMsgNum: 0
    }
  },
  computed: {
    drawer_size() {
      return window.innerWidth < 500 ? '100%' : '50%';
    }
  },
  methods: {
    ChatIconClickHandle() {
      this.show_chat_room = true;
      this.unReadMsgNum = 0;
      this.$refs['chat_room'].ShowUnReadIndicator();

    },
    MsgRevHandle() {
      if (!this.show_chat_room)
        this.unReadMsgNum += 1;
    }
  }
}
</script>

<style>
.chat-icon {
  position: fixed;
  bottom: 50px;
  right: 30px;
  z-index: 3100;
  color: white;
}
</style>