<template>
  <div id="breadcrumb" sticky>
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark sticky">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">GPM</a>
        <button class="navbar-toggler" type="button" v-b-toggle="'navbar'">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbar">
          <div class="navbar-nav">
            <router-link v-for="rout in routes" :key="rout.path" :to="rout.path">{{rout.name}}</router-link>
          </div>
        </div>
      </div>
    </nav>
  </div>
  <!-- <router-view /> -->
  <router-view v-slot="{ Component }">
    <!-- <transition name="el-fade-in"> -->
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
    <!-- </transition> -->
  </router-view>
</template>

<script>
import { configs } from '@/config'
import { GetRouters } from '@/router/index.js';
export default {
  data() {
    return {
      breadcrumbItems: [
        { text: 'SSM', href: '/' },
        { text: 'Log', href: '/log' },
        { text: 'Library' },]
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
}
html,
body {
  margin: 0;
  padding: 0;
}
nav {
  padding: 30px;
}

nav a {
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
  z-index: 3000;
}
</style>
