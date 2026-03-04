<template>
  <div class="main">
    <div v-if="toggle">
      <barcode-item @toggle="onToggle" @result="gotResult" />
    </div>
    <div class="card card-container" v-else>
      <h3>This is sooo</h3>
      <h1>CLUTCH</h1>
      <button @click="ifContinu" v-if="continu" class="btn btn-lg">Continue</button>
      <p v-else class="no-game-msg">No game in progress</p>
      <button @click="ifNu" class="btn btn-lg">New game</button>
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
h1 {
  font-size: 3em;
}

.card-container.card {
  max-width: 300px;
  padding: 40px 40px;
}
.card {
  text-align: center;
  background-color: #f7f7f722;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 15%;
  border-radius: 2px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}
.no-game-msg {
  opacity: 0.5;
  font-size: 0.9em;
  margin: 4px 0 12px;
}
</style>
