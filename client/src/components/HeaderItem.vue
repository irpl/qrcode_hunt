<template>
  <header class="header">
    <router-link to="/"><span>Clutch</span></router-link>
    <div class="nav">
      <router-link to="/make">Make</router-link> | <router-link to="/games">Games</router-link> |
      <router-link to="/about">About</router-link>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderItem",
};
</script>

<style scoped>
.header {
  background-color: #f7f7f722;
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
