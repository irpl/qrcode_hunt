<template>
  <div class="container">
    <div v-if="success">
      <button class="btn btn-sm back-btn back-btn-made" @click="back">Back</button>
      <made-item :game="success" />
    </div>
    <div v-else>
      <h1>Game List</h1>
      <div v-if="loading" class="loading-msg">Loading games...</div>
      <div v-else-if="error" class="error-msg">{{ error }}</div>
      <div v-else-if="games.length === 0" class="loading-msg">No games found.</div>
      <div v-else class="game-list">
        <div v-for="game in games" :key="game._id" class="game-list-card" @click="view(game)">
          <div class="game-list-card-event">{{ game.event }}</div>
          <div>{{ game.gameMaker }}</div>
          <div>{{ dateFilter(game.dateCreated) }}</div>
          <div>{{ game.duration }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MadeItem from "../components/MadeItem.vue";
export default {
  components: {
    MadeItem,
  },
  name: "GamesView",
  data() {
    return {
      games: [],
      success: false,
      loading: true,
      error: null,
    };
  },
  methods: {
    view(game) {
      this.success = game;
    },
    back() {
      this.success = false;
    },
    dateFilter(date) {
      return new Date(date).toDateString();
    },
  },
  created() {
    axios
      .get("/api/games")
      .then((res) => {
        if (res.status === 200 && res.data) {
          this.games = res.data;
        }
      })
      .catch(() => {
        this.error = "Failed to load games. Please try again.";
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>

<style scoped>
.back-btn-made {
  position: absolute;
  right: 10px;
  top: 10px;
}
.game-list {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.game-list-card {
  padding: 10px;
  margin-bottom: 20px;
  width: 210px;
  border-radius: 2px;
  background-color: #f7f7f722;
  cursor: pointer;
}
.game-list-card-event {
  font-size: 1.5rem;
  padding-bottom: 2rem;
  font-weight: 700;
}
.loading-msg {
  margin: 40px auto;
  text-align: center;
  opacity: 0.6;
}
.error-msg {
  margin: 40px auto;
  text-align: center;
  color: #ff6b6b;
}
</style>
