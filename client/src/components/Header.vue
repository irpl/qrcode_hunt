<template>
  <header class="header">
    <router-link to="/"><span>Clutch</span></router-link>
    <div class="nav">
      <router-link to="/make">Make</router-link> |
      <!-- <span></span> -->
      <router-link to="/about">About</router-link>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header"
}
</script>

<style scoped>
  .header {
    background-color: #F7F7F722;
    color: #fff;
    /* text-align: center; */
    padding: 10px;
    /* margin: 0 5.5px; */
    border-radius: 2px;
  }
  .header a {
    color: #ccc;
    padding: 0 10px;
    text-decoration: none;
  }
  .nav {
    float: right;
    /* color: #ccc; */
  }
</style>