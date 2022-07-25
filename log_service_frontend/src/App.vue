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
            <a class="nav-link active" aria-current="page" href="/Admin">ADMIN</a>
            <a class="nav-link active" aria-current="page" href="/">SSM</a>
            <a class="nav-link active" aria-current="page" href="/log">LOG</a>
          </div>
        </div>
      </div>
    </nav>
  </div>
  <router-view />
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
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

#breadcrumb {
}
</style>
