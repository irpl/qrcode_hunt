<template>
  <div class="container">
    <div v-if="success">
      <button class="btn btn-sm back-btn" @click="back">← Back</button>
      <made-item :game="success" />
    </div>
    <div v-else>
      <h1 class="page-title">Games</h1>
      <div v-if="loading" class="status-msg">Loading games...</div>
      <div v-else-if="error" class="status-msg error-msg">{{ error }}</div>
      <div v-else-if="games.length === 0" class="status-msg">No games found.</div>
      <div v-else class="game-list">
        <div v-for="game in games" :key="game._id" class="game-list-card" @click="view(game)">
          <div class="game-list-card-event">{{ game.event }}</div>
          <div class="game-card-meta">
            <span>{{ game.gameMaker }}</span>
            <span class="game-card-dot">·</span>
            <span>{{ game.duration }}</span>
          </div>
          <div class="game-card-date">{{ dateFilter(game.dateCreated) }}</div>
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
.page-title {
  margin-bottom: 20px;
}

.game-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 4px;
}

.game-list-card {
  padding: 16px;
  border-radius: var(--radius);
  background-color: var(--surface-2);
  border: 1px solid var(--border);
  border-top: 3px solid var(--accent);
  cursor: pointer;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
}

.game-list-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border-top-color: #fcd34d;
}

.game-list-card-event {
  font-size: 1.15rem;
  font-weight: 800;
  margin-bottom: 10px;
  line-height: 1.2;
}

.game-card-meta {
  font-size: 0.82rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.game-card-dot {
  opacity: 0.4;
}

.game-card-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  opacity: 0.6;
}

.status-msg {
  margin: 48px auto;
  text-align: center;
  color: var(--text-muted);
}

.error-msg {
  color: var(--error);
}
</style>
