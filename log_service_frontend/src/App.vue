<template>
  <div id="breadcrumb">
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">GPM</a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarID"
          aria-controls="navbarID"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarID">
          <div class="navbar-nav">
            <router-link to="/Admin">ADMIN</router-link>
            <router-link to="/">SSM</router-link>
            <router-link to="/log">LOG</router-link>
            <router-link to="/idms">IDMS</router-link>
            <router-link to="/idms/module-states">IDMS</router-link>
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

export default {
  data() {
    return {
      breadcrumbItems: [
        { text: 'SSM', href: '/' },
        { text: 'Log', href: '/log' },
        { text: 'Library' },]
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
</style>
