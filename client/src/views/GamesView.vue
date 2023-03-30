<template>
  <div class="container">
    <div v-if="success">
      <button class="btn btn-sm back-btn back-btn-made" v-on:click="back">Back</button>
      <made-item v-bind:game="success" />
    </div>
    <div v-else>
      <h1>Game List</h1>
      <div class="game-list">
        <div v-for="(game, index) in games" :key="index" class="game-list-card" @click="() => view(game)">
          <!-- <div > -->
          <div class="game-list-card-event">{{ game.event }}</div>
          <div>{{ game.gameMaker }}</div>
          <div>{{ dateFilter(game.dateCreated) }}</div>
          <div>{{ game.duration }}</div>
          <!-- </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
// import parse from "parse-duration";
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
  computed: {},
  created() {
    axios.get("/api/games").then((res) => {
      if (res.status == 200) {
        if (res.data) {
          this.games = res.data;
        }
      }
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
  /* min-width: 100%; */
  width: 210px;
  border-radius: 2px;
  background-color: #f7f7f722;
}
.game-list-card-event {
  font-size: 1.5rem;
  padding-bottom: 2rem;
  font-weight: 700;
}
</style>
