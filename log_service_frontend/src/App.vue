<template>
  <div id="breadcrumb" sticky>
    <nav class="navbar navbar-expand-sm sticky" v-bind:class="navstyle">
      <div class="container-fluid">
        <a class="navbar-brand" style="position:relative;left:-30px" href="/">GPM</a>
        <button class="navbar-toggler" type="button" v-b-toggle="'navbar'">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div v-if="showNavbar" class="collapse navbar-collapse d-flex flex-row" id="navbar">
          <div class="navbar-nav flex-fill">
            <a
              class="mx-1"
              v-for="rout in routes"
              :key="rout.path"
              @click="routerHandle(rout.path)"
            >{{rout.name}}</a>
          </div>

          <div class="edge-info d-flex flex-row justify-cotent-end">
            <div>
              <div class="name mx-2">{{EdgeName.toUpperCase()}}</div>
              <div class="ip mx-2">{{EdgeIP}}</div>
            </div>
            <NetworkStatusVue class="px-0 py-0 mx-0 my-0" :ip="EdgeIP" toolTipPosition="bottom"></NetworkStatusVue>
          </div>
        </div>
      </div>
    </nav>
  </div>
  <!-- <router-view /> -->
  <router-view v-slot="{ Component }">
    <div class="router-view-content">
      <component :is="Component" />
    </div>
  </router-view>
</template>

<script>
import { configs } from '@/config'
import { GetRouters } from '@/router/index.js';
import { watch } from 'vue'
import { useRoute } from 'vue-router';
import NetworkStatusVue from './components/IDMS/components/NetworkStatus.vue';
export default {
  components: {
    NetworkStatusVue,
  },
  data() {
    return {
      showNavbar: false,
      navstyle: 'bg-dark',
      breadcrumbItems: [
        { text: 'SSM', href: '/' },
        { text: 'Log', href: '/log' },
        { text: 'Library' },],
      EdgeIP: "-",
      EdgeName: "-",
    }
  },
  methods: {
    routerHandle(path) {
      this.EdgeIP = localStorage.getItem('edgeip');
      console.info(path)
      this.$router.push(`${path.replace(':ip', this.EdgeIP)}`);
    }
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
    let route = useRoute();
    watch(() => route.name, (n, o) => {
      this.EdgeIP = localStorage.getItem('edgeip');
      this.EdgeName = localStorage.getItem('edgename');
      var isNotEntryPAGE = this.showNavbar = n + '' !== 'EntryPage';
      console.info(this.showNavbar, n, o)

      if (!isNotEntryPAGE && o != undefined) {
        this.navstyle = localStorage.getItem('entry-page-dark-mode') == 'true' ? 'bg-dark' : 'bg-primary';
        location.reload();
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
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
nav {
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: 30px;
}

nav a {
  cursor: pointer;
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.navbar-brand {
  font-size: 2rem;
}

nav a.router-link-exact-active {
  color: white;
  font-size: large;
  padding-top: 13px;
}
nav a {
  color: rgb(214, 214, 214);
  margin-right: 10px;
  text-decoration: none;
  padding-top: 15px;
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
</style>
