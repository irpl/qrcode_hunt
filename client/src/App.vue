<template>
  <div id="app">
    <header-item v-if="$route.name !== 'quest'" />
    <router-view />
  </div>
</template>

<script>
import HeaderItem from "./components/HeaderItem";
export default {
  name: "app",
  components: {
    HeaderItem,
  },
  created() {
    if (localStorage.getItem("theme") === "light") {
      document.documentElement.classList.add("light");
    }
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;900&display=swap');

:root {
  --bg: #0f0e0d;
  --surface: #1c1a18;
  --surface-2: #2a2826;
  --surface-3: #353230;
  --accent: #f0973a;
  --accent-dark: #d4781c;
  --accent-glow: rgba(240, 151, 58, 0.2);
  --text: #f4f1ee;
  --text-muted: #9e9892;
  --border: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.2);
  --border-accent: rgba(240, 151, 58, 0.4);
  --nav-hover-bg: rgba(255, 255, 255, 0.06);
  --success: #4ade80;
  --error: #f87171;
  --radius: 8px;
  --radius-lg: 16px;
  --transition: 0.18s ease;
}

html.light {
  --bg: #f4f1ee;
  --surface: #ffffff;
  --surface-2: #edeae6;
  --surface-3: #e2ddd8;
  --accent: #d4781c;
  --accent-dark: #b5640f;
  --accent-glow: rgba(212, 120, 28, 0.15);
  --text: #1a1917;
  --text-muted: #6b6560;
  --border: rgba(0, 0, 0, 0.1);
  --border-hover: rgba(0, 0, 0, 0.2);
  --border-accent: rgba(212, 120, 28, 0.4);
  --nav-hover-bg: rgba(0, 0, 0, 0.05);
  --success: #16a34a;
  --error: #dc2626;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  padding: 12px;
  color: var(--text);
  background-color: var(--bg);
  min-height: 100vh;
}

hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.5em 0;
}

h1 {
  font-size: 1.75rem;
  font-weight: 900;
  letter-spacing: -0.01em;
}

h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.8rem;
  margin-bottom: 12px;
}

#app {
  font-family: 'Raleway', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  max-width: 520px;
  margin: 0 auto;
}

.container {
  padding: 28px 24px;
  border-radius: var(--radius-lg);
  background-color: var(--surface);
  border: 1px solid var(--border);
  position: relative;
}

/* Buttons */
.btn {
  color: var(--text);
  height: 52px;
  user-select: none;
  cursor: pointer;
  background-color: var(--surface-2);
  padding: 0 20px;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 15px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  transition: background-color var(--transition), border-color var(--transition), transform var(--transition), box-shadow var(--transition);
  letter-spacing: 0.03em;
}

.btn:hover,
.btn:focus {
  background-color: var(--surface-3);
  border-color: var(--border-hover);
  transform: translateY(-1px);
  outline: none;
}

.btn:active {
  transform: translateY(0);
}

.btn-accent {
  background-color: var(--accent);
  color: #0f0e0d;
  border-color: var(--accent);
  font-weight: 900;
}

.btn-accent:hover,
.btn-accent:focus {
  background-color: var(--accent-dark);
  border-color: var(--accent-dark);
  box-shadow: 0 4px 16px var(--accent-glow);
  transform: translateY(-1px);
}

.btn-lg {
  width: 100%;
  display: block;
  margin-bottom: 10px;
}

.back-btn {
  position: absolute;
  z-index: 1;
  top: 16px;
  right: 16px;
}

.btn-sm {
  height: 36px;
  font-size: 13px;
  padding: 0 14px;
}
</style>
