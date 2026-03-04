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
          <div class="quest-hint" @click="toggleHint">
            <div>💡</div>
            <div>Hints: {{ hints_left }}</div>
          </div>
        </div>
        <div v-if="openModal" class="modal-win">
          <div class="modal-win-content">
            <div class="modal-win-tick">✔</div>
            <div>That's it!</div>
            <div>Here are your stats:</div>
            <div>
              <p>You've figured out {{ stats.points }} clues</p>
              <p>You used {{ stats.deduction }} hints</p>
              <p>Your final score is {{ stats.final }}</p>
            </div>
            <div>Head back to the Science Games room!</div>
            <div>
              <button class="modal-btn btn btn-lg" @click="toggleModal">Cool</button>
            </div>
          </div>
        </div>
        <div v-if="openHint" class="modal-hint">
          <div class="modal-hint-content">
            <div>Here's your hint. I hope it was worth it.</div>
            <img :src="quests[state].hint" alt="Hint image" />
            <div>
              <button class="modal-btn btn btn-lg" @click="toggleHint">Close</button>
            </div>
          </div>
        </div>

        <div v-if="!openHint">
          <h1>Quest list</h1>
          <div class="quests" v-if="quests[0]">
            <ol>
              <li v-for="(quest, index) in quests" :key="quest._id" class="quest">
                <span :class="{ 'not-yet': !quest.completed && index !== state, 'is-completed': quest.completed }">{{ quest.title }}</span>
                <span :class="{ 'is-completed-marker': quest.completed }"></span>
              </li>
            </ol>
            <div class="clue">
              <h1>Clue:</h1>
              <p>"{{ quests[state].clue }}"</p>
            </div>
            <button v-if="!end_game" class="inv btn btn-lg" type="button" @click="onToggle">Investigate</button>
            <button v-else class="inv btn btn-lg" type="button" @click="toggleModal">Show Stats</button>
            <div class="instru">
              <span>To scan the secret qr-code, tap the "Investigate" button.</span>
            </div>
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
      quests: [],
      state: 0,
      timeLeft: 1000000,
      openModal: false,
      openHint: false,
      hint_used: false,
      hints_left: 3,
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
      if ((this.hints_left > 0 || this.openHint) && !this.end_game) {
        this.openHint = !this.openHint;
      }
      if (!this.hint_used && !this.end_game && this.openHint) {
        this.hints_left = this.hints_left - 1;
        this.hint_used = true;
      }
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

          if (this.state < this.quests.length - 1) {
            this.state++;
            localStorage.setItem(STORAGE_KEYS.QUEST_STATE, this.state);
          }
        }
      });
      this.onToggle();
      this.checkGameState();
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
ol {
  padding-left: 20px;
}
.modal-win {
  position: fixed;
  z-index: 9;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}
.modal-hint-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  margin: 15% auto;
  border-radius: 2px;
  width: 100%;
}
.modal-hint-content .modal-btn {
  background-color: #2a2826;
}
.modal-win-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #2a2826;
  margin: 15% auto;
  padding: 20px;
  border: 8px solid #7c7671;
  border-radius: 2px;
  width: 80%;
}
.modal-hint-content > img {
  width: 100%;
}
.modal-win-tick {
  color: #0f0;
  font-size: 6rem;
}
.modal-btn {
  width: 100px;
  height: 50px;
  margin-top: 20px;
  background-color: #7c7671;
}
.no-game {
  margin: 100px 50px;
  text-align: center;
  font-size: 24px;
}
.quest {
  padding: 10px 10px;
}
.quest-countdown {
  border-radius: 3px;
  background-color: #2a2826;
  padding: 5px 10px;
  width: 70px;
  display: flex;
  justify-content: center;
}
.quest-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.quest-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 3px;
  background-color: #2a2826;
  padding: 5px 10px;
}
.not-yet {
  opacity: 0.5;
  color: #7c7671;
  background-color: #7c7671;
  user-select: none;
}
.instru {
  padding: 10px 0;
  opacity: 0.4;
  display: flex;
  justify-content: center;
}
.is-completed {
  text-decoration: line-through;
}
.is-completed-marker::after {
  content: " [COMPLETED] ✔";
  color: rgb(0, 255, 0);
}
.quests button {
  width: 100%;
  display: block;
  margin-bottom: 10px;
  z-index: 1;
  position: relative;
  box-sizing: border-box;
}
.clue {
  margin: 50px 0;
}
</style>
