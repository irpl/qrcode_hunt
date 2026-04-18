<template>
  <header class="header">
    <router-link to="/" class="brand">CLUTCH</router-link>
    <nav class="nav">
      <router-link to="/make">Make</router-link>
      <router-link to="/games">Games</router-link>
      <router-link to="/about">About</router-link>
      <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        {{ isDark ? '☀️' : '🌙' }}
      </button>
    </nav>
  </header>
</template>

<script>
export default {
  name: "HeaderItem",
  data() {
    return {
      isDark: localStorage.getItem("theme") !== "light",
    };
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark;
      if (this.isDark) {
        document.documentElement.classList.remove("light");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.add("light");
        localStorage.setItem("theme", "light");
      }
    },
  },
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
  align-items: center;
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
  background: var(--nav-hover-bg);
}

.nav a.router-link-active {
  color: var(--accent);
  background: var(--accent-glow);
}

.theme-toggle {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 5px 9px;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  margin-left: 4px;
  transition: border-color var(--transition), background var(--transition);
}

.theme-toggle:hover {
  border-color: var(--border-hover);
  background: var(--nav-hover-bg);
}
</style>
