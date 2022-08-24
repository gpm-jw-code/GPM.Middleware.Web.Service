<template>
  <div id="admin">
    <div id="breadcrumb" sticky>
      <nav class="navbar navbar-expand-lg bg-dark">
        <a class="navbar-brand">
          <span style="font-size:30px">GPM</span>
          <span class="mx-3" style="font-size:20px">ADMIN</span>
        </a>
        <button class="navbar-toggler bg-light" v-b-toggle.navbarNav ref="toggle_button">
          <i class="bi bi-list"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a href="/" class="nav-link">IDMS</a>
            </li>
            <li class="nav-item">
              <a>
                <router-link class="nav-link" to="/">OV</router-link>
              </a>
            </li>
            <li class="nav-item">
              <a>
                <router-link class="nav-link" to="/2">OV</router-link>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    <!-- <router-view /> -->
    <router-view v-slot="{ Component }">
      <div class="router-view-content">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
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

<style scoped>
#admin {
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
body,
.router-view-content {
  margin: 0;
  padding: 0;
  height: 100vh;
  background-color: #000000;
}

#breadcrumb {
  position: fixed;
  width: 100%;
  z-index: 3001;
}
.router-view-content {
  padding-top: 75px;
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
