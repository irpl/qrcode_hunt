<template>
  <div>
    <div v-if="toggle">
      <barcode-item @toggle="onToggle" @result="gotResult" />
    </div>
    <div class="container" v-else>
      <div>
        <div class="quest-top">
          <vue-countdown @end="onCountdownEnd" ref="countdown" tag="div" class="quest-countdown" :time="timeLeft" v-slot="{ hours, minutes, seconds }">
            {{ String(hours).padStart(2, "0") }}:{{ String(minutes).padStart(2, "0") }}:{{ String(seconds).padStart(2, "0") }}
          </vue-countdown>
          <button class="hint-btn" @click="toggleHint" :disabled="hints_left === 0 || end_game">
            <span class="hint-icon">💡</span>
            <span class="hint-count">{{ hints_left }}</span>
          </button>
        </div>

        <div v-if="openModal" class="modal-overlay">
          <div class="modal-win-content">
            <div class="modal-win-tick">✔</div>
            <h2 class="modal-title">That's it!</h2>
            <div class="stats-grid">
              <div class="stat-block">
                <div class="stat-value">{{ stats.points }}</div>
                <div class="stat-label">Clues solved</div>
              </div>
              <div class="stat-block">
                <div class="stat-value">{{ stats.deduction }}</div>
                <div class="stat-label">Hints used</div>
              </div>
              <div class="stat-block accent">
                <div class="stat-value">{{ stats.final }}</div>
                <div class="stat-label">Final score</div>
              </div>
            </div>
            <p class="modal-footer-msg">Head back to the Science Games room!</p>
            <button class="btn btn-lg btn-accent" @click="goHome">Go Home</button>
          </div>
        </div>

        <div v-if="openQuitConfirm" class="modal-overlay">
          <div class="modal-win-content">
            <h2 class="modal-title">Quit game?</h2>
            <p class="modal-footer-msg">Your progress will be lost and you won't be able to resume.</p>
            <button class="btn btn-lg btn-danger" @click="quitGame">Yes, quit</button>
            <button class="btn btn-lg" @click="openQuitConfirm = false">Keep playing</button>
          </div>
        </div>

        <div v-if="openHint" class="modal-overlay">
          <div class="modal-hint-content">
            <p class="hint-caption">Here's your hint. I hope it was worth it.</p>
            <div v-if="hintLoading" class="hint-loading">Loading hint...</div>
            <img v-else-if="hintImage" :src="hintImage" alt="Hint image" class="hint-img" />
            <p v-else class="hint-caption">No hint available for this clue.</p>
            <button class="btn btn-lg" @click="toggleHint">Close</button>
          </div>
        </div>

        <div v-if="!openHint">
          <div class="quests" v-if="quests[0]">
            <div class="clue-card">
              <div class="clue-label">Current clue</div>
              <p class="clue-text">"{{ quests[state].clue }}"</p>
            </div>
            <ol class="quest-list">
              <li v-for="(quest, index) in quests" :key="quest._id"
                  :class="['quest-item', { 'quest-active': index === state && !quest.completed, 'quest-done': quest.completed, 'quest-locked': !quest.completed && index !== state }]">
                <span class="quest-status-dot"></span>
                <span class="quest-title-text">{{ quest.title }}</span>
              </li>
            </ol>
            <button v-if="!end_game" class="btn btn-lg btn-accent inv" type="button" @click="onToggle">
              🔍 Investigate
            </button>
            <button v-else class="btn btn-lg" type="button" @click="toggleModal">Show Stats</button>
            <div class="instru">Tap Investigate to scan the hidden QR code.</div>
            <div v-if="!end_game" class="exit-links">
              <button class="exit-link" @click="exitKeepProgress">Save & exit</button>
              <span class="exit-sep">·</span>
              <button class="exit-link exit-link-danger" @click="confirmQuit">Quit game</button>
            </div>
            <p v-if="!end_game" class="exit-note">Timer keeps running if you save & exit.</p>
          </div>
          <div v-else>
            <div class="no-game">{{ game }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarcodeItem from "../components/BarcodeItem.vue";
import axios from "axios";
import parse from "parse-duration";
import VueCountdown from "@chenfengyuan/vue-countdown";
import { STORAGE_KEYS } from "../constants/storage";

export default {
  components: {
    BarcodeItem,
    VueCountdown,
  },
  name: "QuestView",
  data() {
    return {
      toggle: false,
      game: "loading...",
      gameId: null,
      quests: [],
      state: 0,
      timeLeft: 1000000,
      openModal: false,
      openHint: false,
      hint_used: false,
      hints_left: 3,
      hintImage: null,
      hintLoading: false,
      openQuitConfirm: false,
      stats: {},
      end_game: false,
    };
  },
  watch: {
    openModal(newValue) {
      if (newValue) {
        const points = this.quests.filter((quest) => quest.completed).length;
        const deduction = 3 - this.hints_left;
        const final = points - deduction / 2;
        this.stats = { points, deduction, final };
      }
    },
    toggle(newValue) {
      if (!newValue) {
        const endTimeStr = localStorage.getItem(STORAGE_KEYS.END_TIME);
        const endTime = endTimeStr ? parseInt(endTimeStr) : null;
        if (endTime) {
          this.timeLeft = endTime - Date.now() > 0 ? endTime - Date.now() : 0;
        }
      }
    },
    hints_left(newValue) {
      localStorage.setItem(STORAGE_KEYS.HINTS_LEFT, newValue);
    },
  },
  methods: {
    shuffleArray(array) {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
    sortQuests(quests) {
      const orderStr = localStorage.getItem(STORAGE_KEYS.QUEST_ORDER);
      let order;
      if (!orderStr) {
        const indices = [...Array(quests.length).keys()];
        order = this.shuffleArray(indices);
        localStorage.setItem(STORAGE_KEYS.QUEST_ORDER, JSON.stringify(order));
      } else {
        order = JSON.parse(orderStr);
      }
      return order.map((i) => quests[i]);
    },
    toggleModal() {
      this.openModal = !this.openModal;
    },
    onCountdownEnd() {
      this.end_game = true;
      this.toggleModal();
    },
    toggleHint() {
      if (this.openHint) {
        this.openHint = false;
        this.hintImage = null;
        return;
      }
      if (this.hints_left === 0 || this.end_game) return;
      this.openHint = true;
      if (!this.hint_used) {
        this.hints_left = this.hints_left - 1;
        this.hint_used = true;
      }
      this.hintLoading = true;
      const questId = this.quests[this.state]._id;
      axios
        .get(`/api/game/${this.gameId}/hint/${questId}`)
        .then((res) => {
          this.hintImage = res.data.hint;
        })
        .catch(() => {
          this.hintImage = null;
        })
        .finally(() => {
          this.hintLoading = false;
        });
    },
    onToggle() {
      this.toggle = !this.toggle;
    },
    checkGameState() {
      if (this.quests.filter((quest) => !quest.completed).length === 0) {
        localStorage.removeItem(STORAGE_KEYS.GAME_ACTIVE);
        localStorage.removeItem(STORAGE_KEYS.GAME_NAME);
        localStorage.removeItem(STORAGE_KEYS.QUEST_STATE);
        this.end_game = true;
        this.toggleModal();
      }
    },
    gotResult(result) {
      this.quests.forEach((quest) => {
        if (quest._id === result && !quest.completed && this.quests.indexOf(quest) === this.state) {
          quest.completed = true;
          this.hint_used = false;
          this.hintImage = null;

          if (this.state < this.quests.length - 1) {
            this.state++;
            localStorage.setItem(STORAGE_KEYS.QUEST_STATE, this.state);
          }
        }
      });
      this.onToggle();
      this.checkGameState();
    },
    exitKeepProgress() {
      window.removeEventListener("beforeunload", this.handleBeforeUnload);
      this.$router.push("/");
    },
    confirmQuit() {
      this.openQuitConfirm = true;
    },
    quitGame() {
      window.removeEventListener("beforeunload", this.handleBeforeUnload);
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
      this.$router.push("/");
    },
    goHome() {
      window.removeEventListener("beforeunload", this.handleBeforeUnload);
      this.$router.push("/");
    },
    handleBeforeUnload(e) {
      if (!this.end_game) {
        e.preventDefault();
        e.returnValue = "";
      }
    },
  },
  created() {
    axios
      .get(`/api/game?event=${this.$route.query.event}`)
      .then((res) => {
        if (res.data && res.data._id) {
          this.gameId = res.data._id;
          this.quests = this.sortQuests(res.data.quests);

          localStorage.setItem(STORAGE_KEYS.GAME_ACTIVE, "1");
          localStorage.setItem(STORAGE_KEYS.GAME_NAME, this.$route.query.event);

          const startTimeStr = localStorage.getItem(STORAGE_KEYS.START_TIME);
          const startTime = startTimeStr ? parseInt(startTimeStr) : Date.now();
          let endTimeStr = localStorage.getItem(STORAGE_KEYS.END_TIME);
          let endTime;
          if (!endTimeStr) {
            endTime = startTime + parse(res.data.duration);
            localStorage.setItem(STORAGE_KEYS.END_TIME, endTime);
          } else {
            endTime = parseInt(endTimeStr);
          }

          this.timeLeft = endTime - Date.now() > 0 ? endTime - Date.now() : 0;

          const savedHints = localStorage.getItem(STORAGE_KEYS.HINTS_LEFT);
          if (savedHints !== null) {
            this.hints_left = parseInt(savedHints);
          }

          const progressStr = localStorage.getItem(STORAGE_KEYS.QUEST_STATE);
          if (progressStr) {
            const progress = parseInt(progressStr);
            for (let i = 0; i < progress; i++) {
              this.quests[i].completed = true;
            }
            this.state = progress;
          }
        } else {
          this.game = "Looks like there aren't any games at the moment. 😔";
          localStorage.setItem(STORAGE_KEYS.GAME_ACTIVE, "0");
          localStorage.setItem(STORAGE_KEYS.GAME_NAME, "");
        }
      })
      .catch(() => {
        this.game = "Failed to load game. Please check your connection.";
      });

    window.addEventListener("beforeunload", this.handleBeforeUnload);
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  },
};
</script>

<style scoped>
/* Top bar */
.quest-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.quest-countdown {
  font-size: 1.4rem;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
  color: var(--accent);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 14px;
}

.hint-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 14px;
  cursor: pointer;
  color: var(--text);
  font-family: 'Raleway', sans-serif;
  transition: border-color var(--transition), opacity var(--transition);
}

.hint-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.hint-btn:not(:disabled):hover {
  border-color: var(--accent);
}

.exit-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 10px 0 4px;
}

.exit-sep {
  color: var(--text-muted);
  opacity: 0.4;
  font-size: 0.78rem;
}

.exit-link {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 0.78rem;
  font-family: 'Raleway', sans-serif;
  opacity: 0.55;
  padding: 0;
  transition: color var(--transition), opacity var(--transition);
}

.exit-link:hover {
  opacity: 1;
  color: var(--text);
}

.exit-link-danger:hover {
  color: var(--error);
}

.exit-note {
  text-align: center;
  font-size: 0.72rem;
  color: var(--text-muted);
  opacity: 0.4;
  padding-bottom: 4px;
}

.btn-danger {
  background-color: var(--error);
  color: #fff;
  border-color: var(--error);
  font-weight: 900;
}

.btn-danger:hover,
.btn-danger:focus {
  filter: brightness(0.88);
  border-color: var(--error);
}

.hint-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.hint-count {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
}

/* Quest list */
.quest-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
  max-height: 180px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--surface-3) transparent;
}

.quest-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius);
  margin-bottom: 4px;
  transition: background var(--transition);
}

.quest-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--surface-3);
  border: 1px solid rgba(255,255,255,0.15);
}

.quest-title-text {
  font-size: 0.95rem;
  font-weight: 600;
}

.quest-active {
  background: rgba(240, 151, 58, 0.08);
  border: 1px solid var(--border-accent);
}

.quest-active .quest-status-dot {
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 6px var(--accent-glow);
}

.quest-done {
  opacity: 0.45;
}

.quest-done .quest-status-dot {
  background: var(--success);
  border-color: var(--success);
}

.quest-done .quest-title-text {
  text-decoration: line-through;
}

.quest-locked {
  opacity: 0.25;
  user-select: none;
}

/* Clue */
.clue-card {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius);
  padding: 16px 18px;
  margin: 20px 0 24px;
}

.clue-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 8px;
}

.clue-text {
  font-size: 1.05rem;
  line-height: 1.6;
  font-style: italic;
  color: var(--text);
}

.inv {
  margin-bottom: 12px;
}

.instru {
  text-align: center;
  font-size: 0.78rem;
  color: var(--text-muted);
  opacity: 0.6;
  padding-bottom: 8px;
}

/* Modals */
.modal-overlay {
  position: fixed;
  z-index: 9;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-win-content {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 32px 24px;
  width: 100%;
  max-width: 360px;
  text-align: center;
}

.modal-win-tick {
  font-size: 4rem;
  color: var(--success);
  line-height: 1;
  margin-bottom: 8px;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 900;
  margin-bottom: 24px;
  color: var(--text);
  text-transform: none;
  letter-spacing: normal;
}

.stats-grid {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-block {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 16px;
  min-width: 72px;
}

.stat-block.accent {
  border-color: var(--border-accent);
  background: rgba(240, 151, 58, 0.06);
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 900;
  line-height: 1;
}

.stat-block.accent .stat-value {
  color: var(--accent);
}

.stat-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.modal-footer-msg {
  font-size: 0.88rem;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.modal-hint-content {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.hint-caption {
  font-size: 0.9rem;
  color: var(--text-muted);
  text-align: center;
}

.hint-img {
  width: 100%;
  border-radius: var(--radius);
}

.hint-loading {
  font-size: 0.9rem;
  color: var(--text-muted);
  padding: 24px 0;
}

.no-game {
  margin: 80px 24px;
  text-align: center;
  font-size: 1.1rem;
  color: var(--text-muted);
}
</style>
