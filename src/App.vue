<script setup>
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
</script>

<template>
  <el-container id="app">
    <Header />
    <el-main class="main-content">
      <router-view />
    </el-main>
    <Footer />
  </el-container>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  min-height: 100vh;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
</style>

