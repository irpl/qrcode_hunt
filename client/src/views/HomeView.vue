<template>
  <div class="home">
    <div v-if="toggle">
      <barcode-item @toggle="onToggle" @result="gotResult" />
    </div>
    <div class="home-card" v-else>
      <div class="home-badge">QR Code Hunt</div>
      <h1 class="home-title">CLUTCH</h1>
      <p class="home-sub">Scan. Solve. Win.</p>
      <div class="home-actions">
        <button @click="ifNu" class="btn btn-lg btn-accent">New game</button>
        <button @click="ifContinu" v-if="continu" class="btn btn-lg">Continue</button>
        <p v-else class="no-game-msg">No game in progress</p>
      </div>
    </div>
  </div>
</template>

<script>
import BarcodeItem from "../components/BarcodeItem.vue";
import { STORAGE_KEYS } from "../constants/storage";
export default {
  components: {
    BarcodeItem,
  },
  name: "HomeView",
  data() {
    return {
      continu: false,
      toggle: false,
    };
  },
  methods: {
    onToggle() {
      this.toggle = !this.toggle;
    },
    gotResult(result) {
      localStorage.setItem(STORAGE_KEYS.START_TIME, Date.now());
      this.$router.push({ path: "quest", query: { event: result } });
    },
    ifNu() {
      if (this.continu && !confirm("Starting a new game will erase your current progress. Continue?")) {
        return;
      }
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
      localStorage.setItem(STORAGE_KEYS.QUEST_STATE, "0");
      this.onToggle();
    },
    ifContinu() {
      const gameName = localStorage.getItem(STORAGE_KEYS.GAME_NAME);
      this.$router.push({ path: "quest", query: { event: gameName } });
    },
  },
  created() {
    if (localStorage.getItem(STORAGE_KEYS.GAME_ACTIVE) === "1") {
      this.continu = true;
    }
  },
};
</script>

<style scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px);
}

.home-card {
  text-align: center;
  padding: 52px 32px 40px;
  border-radius: var(--radius-lg);
  background: var(--surface);
  border: 1px solid var(--border);
  width: 100%;
}

.home-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  border: 1px solid var(--border-accent);
  padding: 4px 14px;
  border-radius: 100px;
  margin-bottom: 24px;
}

.home-title {
  font-size: 5rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: 8px;
  background: linear-gradient(135deg, var(--accent) 0%, #fcd34d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.home-sub {
  color: var(--text-muted);
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  margin-bottom: 40px;
}

.home-actions {
  display: flex;
  flex-direction: column;
}

.no-game-msg {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin: 0 0 10px;
}
</style>
