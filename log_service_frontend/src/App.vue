<template>
  <div id="breadcrumb" sticky>
    <el-backtop :right="30" :bottom="50" />
    <!-- <el-backtop :right="30" :bottom="100" :visibility-height="-1" /> -->
    <nav v-if="!showNavbar" class="navbar navbar-expand-lg bg-primary">
      <a class="navbar-brand" href="/">
        <span style="font-size:30px">GPM</span>
      </a>
      <div class="navbar-brand">EDGES VIEW</div>
    </nav>
    <nav v-else class="navbar navbar-expand-lg bg-primary">
      <a class="navbar-brand" href="/">
        <span style="font-size:30px">GPM</span>
      </a>
      <el-popover :content="EdgeIP">
        <template #reference>
          <div class="navbar-brand">{{ EdgeName? EdgeName.toUpperCase():''}}</div>
        </template>
      </el-popover>
      <button class="navbar-toggler bg-primary" v-b-toggle.navbarNav ref="toggle_button">
        <i class="bi bi-list"></i>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item" v-for="rout in routes" :key="rout.path">
            <a class="nav-link" active @click="routerHandle(rout.path)">{{rout.name}}</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
  <!-- <router-view /> -->
  <router-view v-slot="{ Component }">
    <div class="router-view-content">
      <component :is="Component" />
    </div>
  </router-view>
  <NotificationIconVue v-show="isNotEntryPAGE" ref="alarm_noti_icon" :edge_ip="EdgeIP"></NotificationIconVue>
  <ReleaseNote></ReleaseNote>
  <ChatIconVue></ChatIconVue>
</template>

<script>
import { configs } from '@/config'
import { GetRouters } from '@/router/index.js';
import { watch } from 'vue'
import { useRoute } from 'vue-router';
import NetworkStatusVue from './components/IDMS/components/NetworkStatus.vue';
import ReleaseNote from '@/components/IDMS/components/AppReleaseView/ReleaseNoteView.vue'
import NotificationIconVue from './components/IDMS/AlarmForm/NotificationIcon.vue';
import ChatIconVue from './components/Chat/ChatIcon.vue';
export default {
  components: {
    NetworkStatusVue, ReleaseNote, NotificationIconVue, ChatIconVue
  },
  data() {
    return {
      seletedRouteName: "診斷頁面",
      showNavbar: false,
      navstyle: 'bg-primary',
      breadcrumbItems: [
        { text: 'SSM', href: '/' },
        { text: 'Log', href: '/log' },
        { text: 'Library' },],
      EdgeIP: "-",
      EdgeName: "-",
      isNotEntryPAGE: false
    }
  },
  methods: {
    routerHandle(path) {
      console.info(this.$refs['toggle_button']);
      this.$refs['toggle_button'].click();
      this.EdgeIP = localStorage.getItem('edgeip');
      console.info(path)
      this.$router.push(`${path.replace(':ip', this.EdgeIP)}`);
    },
  },
  computed: {
    mode() {
      return configs.mode
    },
    routes() {
      return GetRouters();
    }
  },
  mounted() {
    window.addEventListener('unload', () => localStorage.setItem('idms-previous-route-name', this.seletedRouteName))

    var previousRoutName = localStorage.getItem('idms-previous-route-name');
    if (previousRoutName != undefined && previousRoutName != null) {
      this.seletedRouteName = previousRoutName;
    }
    let route = useRoute();
    watch(() => route.name, (n, o) => {
      console.info('route change', n, o);
      this.EdgeIP = localStorage.getItem('edgeip');
      this.EdgeName = localStorage.getItem('edgename');
      this.seletedRouteName = n;
      this.isNotEntryPAGE = this.showNavbar = n + '' !== 'EntryPage';
      console.info(this.showNavbar, n, o)
      if (!this.isNotEntryPAGE && o != undefined) {
        this.navstyle = localStorage.getItem('entry-page-dark-mode') == 'true' ? 'bg-dark' : 'bg-primary';
        location.reload();
      }

      if (this.isNotEntryPAGE) {
        this.$refs.alarm_noti_icon.WsIni(this.EdgeIP);
      }

    })

  }
}

</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

nav {
  padding: 10px;
}

.nav-link,
.navbar-brand {
  color: white;
  cursor: pointer;
}

.nav-link:active {
  color: black;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#breadcrumb {
  position: fixed;
  width: 100%;
  z-index: 3001;
}
.router-view-content {
  height: 100%;
  padding-top: 75px;
}

.edge-info {
  color: white;
  font-size: larger;
  font-weight: bold;
  letter-spacing: 2px;
  text-align: left;
}

.edge-info .ip {
  color: rgb(173, 173, 173);
  font-size: smaller;
  letter-spacing: 1px;
}

.idms-alarm-form-badge {
  z-index: 3009;
}
</style>
