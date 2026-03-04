<template>
  <header class="header">
    <router-link to="/" class="brand"><span>Clutch</span></router-link>
    <nav class="nav">
      <router-link to="/make">Make</router-link>
      <router-link to="/games">Games</router-link>
      <router-link to="/about">About</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: "HeaderItem",
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f7f7f722;
  color: #fff;
  padding: 10px;
  border-radius: 2px;
}
.header a {
  color: #ccc;
  padding: 0 10px;
  text-decoration: none;
}
.header a.router-link-active {
  color: #fff;
  font-weight: bold;
}
.nav {
  display: flex;
  gap: 4px;
}
</style>
