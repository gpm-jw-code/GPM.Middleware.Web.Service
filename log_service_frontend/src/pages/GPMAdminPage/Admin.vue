<template>
  <div id="Admin">
    <div class="breadcrumb" sticky>
      <nav class="navbar navbar-expand-lg bg-primary">
        <a class="navbar-brand" href="/">
          <span style="font-size:30px">GPM</span>
        </a>
        <button class="navbar-toggler bg-primary" v-b-toggle.navbarNav ref="toggle_button">
          <i class="bi bi-list"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="fade-in navbar-nav">
            <li class="nav-item">
              <a>a1</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    <h1>ADMIN PAGE RENDER SUCCESS!</h1>
    <!-- <router-view /> -->
    <router-view v-slot="{ Component }">
      <div class="router-view-content">
        <component :is="Component" />
      </div>
    </router-view>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
    }
  },
  methods: {

  },
  computed: {
  },
  mounted() {
  }
}

</script>

<style>
#Admin {
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
  border-bottom: none;
  padding-bottom: 0px;
}
.nav-link {
  margin-top: 4px;
}
.nav-link:hover {
  color: white;
  border-bottom: 0.1rem solid white;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.breadcrumb {
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
.route-link-selected {
  border-bottom: 0.2rem double white;
}
.nav-link-underline {
  position: absolute;
  bottom: 21px;
  padding-left: 12px;
  margin: -2px 8px;
  background-color: white;
  height: 0.1rem;
}
</style>
