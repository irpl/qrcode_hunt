<template>
  <header class="header">
    <router-link to="/" class="brand">CLUTCH</router-link>
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
  padding: 12px 16px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
  margin-bottom: 16px;
}

.brand {
  font-weight: 900;
  font-size: 1.05rem;
  letter-spacing: 0.08em;
  color: var(--accent) !important;
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 2px;
}

.nav a {
  color: var(--text-muted);
  padding: 6px 12px;
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 600;
  border-radius: 6px;
  transition: color var(--transition), background-color var(--transition);
}

.nav a:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.06);
}

.nav a.router-link-active {
  color: var(--accent);
  background: var(--accent-glow);
}
</style>
