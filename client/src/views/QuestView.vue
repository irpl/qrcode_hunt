<template>
  <div>
    <div v-if="toggle">
      <barcode-item @toggle="onToggle" @result="gotResult" />
    </div>
    <div class="container" v-else>
      <div>
        <div class="quest-top">
          <vue-countdown ref="countdown" tag="div" class="quest-countdown" :time="timeLeft" v-slot="{ hours, minutes, seconds }">
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
            <div>That's it! Head back to the Science Games room!</div>
            <div>
              <button class="modal-btn btn btn-lg" @click="toggleModal">Cool</button>
            </div>
          </div>
        </div>
        <div v-if="openHint" class="modal-hint">
          <div class="modal-hint-content">
            <div>Here's your hint. I hope it as worth it.</div>
            <img :src="quests[state].hint" />
            <div>
              <button class="modal-btn btn btn-lg" @click="toggleHint">Cool</button>
            </div>
          </div>
        </div>

        <div v-if="!openHint">
          <h1>Quest list</h1>
          <div class="quests" v-if="quests[0]">
            <ol>
              <li v-for="(quest, index) in quests" :key="index" class="quest">
                <span :class="{ 'not-yet': !quest.completed && index !== state, 'is-completed': quest.completed }">{{ quest.title }}</span>
                <span :class="{ 'is-completed-marker': quest.completed }"></span>
              </li>
            </ol>
            <div class="clue">
              <h1>Clue:</h1>
              <p>"{{ quests[state].clue }}"</p>
            </div>
            <button class="inv btn btn-lg" type="button" @click="onToggle">Investigate</button>
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
      timeLeft: 10000,
      openModal: false,
      openHint: false,
      hint_used: false,
      hints_left: 3,
      // state: this.quests.filter(q => q.completed).length-1
    };
  },
  watch: {
    toggle(newValue) {
      if (!newValue) {
        var endTime = parseInt(localStorage.getItem("endTime"));
        this.timeLeft = endTime - Date.now() > 0 ? endTime - Date.now() : 0;
      }
    },
  },
  methods: {
    sortQuests(quests) {
      function func(_a, _b) {
        return 0.5 - Math.random();
      }
      var length = quests.length;

      var order = [];
      if (!localStorage.getItem("order")) {
        order = [...Array(length).keys()].sort(func);
        localStorage.setItem("order", JSON.stringify(order));
      } else {
        order = JSON.parse(localStorage.getItem("order"));
      }

      var sorted = order.map((i) => quests[i]);
      return sorted;
    },
    onCountdownEnd() {
      alert("boop");
    },
    toggleModal() {
      this.openModal = !this.openModal;
    },
    toggleHint() {
      if (this.hints_left > 0 || this.openHint == true) this.openHint = !this.openHint;
      if (!this.hint_used) {
        this.hints_left = this.hints_left - 1;
        this.hint_used = true;
      }
    },
    onToggle() {
      this.toggle = !this.toggle;
    },
    async checkGameState() {
      if (this.quests.filter((quest) => !quest.completed).length === 0) {
        // if (this.state === this.quests.length) {
        localStorage.removeItem("game");
        localStorage.removeItem("gameName");
        localStorage.removeItem("state");
        this.$refs.countdown.end();
        this.toggleModal();
        // await alert("That's it! You are soooo Clutch!");
      }
    },
    gotResult(result) {
      this.quests.map((quest) => {
        if (quest._id === result && !quest.completed && this.quests.indexOf(quest) === this.state) {
          quest.completed = true;
          this.hint_used = false;

          if (this.state < this.quests.length && this.state !== this.quests.length - 1) {
            this.state++;
            localStorage.setItem("state", this.state);
          }
        }
      });
      this.onToggle();
      this.checkGameState();
    },
  },
  created() {
    axios.get(`/api/game?event=${this.$route.query.event}`).then(async (res) => {
      if (res.data) {
        this.quests = await this.sortQuests(res.data.quests);

        localStorage.setItem("game", "1");
        localStorage.setItem("gameName", this.$route.query.event);

        var startTime = parseInt(localStorage.getItem("startTime"));
        var endTime = parseInt(localStorage.getItem("endTime"));
        if (!endTime) {
          endTime = startTime + parse(res.data.duration);
          localStorage.setItem("endTime", endTime);
        }

        this.timeLeft = endTime - Date.now() > 0 ? endTime - Date.now() : 0;

        let progress = localStorage.getItem("state");
        if (progress) {
          progress = parseInt(progress);
          for (let i = 0; i < progress; i++) {
            this.quests[i].completed = true;
          }
          this.state = progress;
        }
      } else {
        this.game = "Looks like there aren't any games at the moment. 😔";
        localStorage.setItem("game", "0");
        localStorage.setItem("gameName", "");
      }
    });
    // .catch(this.game = "#err")
  },
};
</script>

<style scoped>
ol {
  padding-left: 20px;
}
.modal-win {
  position: fixed; /* Stay in place */
  z-index: 9; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */

  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}
.modal-hint-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  /* background-color: #2a2826; */
  margin: 15% auto; /* 15% from the top and centered */
  /* padding: 20px; */
  /* border: 8px solid #7c7671; */
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
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 8px solid #7c7671;
  border-radius: 2px;
  width: 80%; /* Could be more or less, depending on screen size */
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
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
  user-select: none; /* Don't let user highlight text */
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
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.clue {
  margin: 50px 0;
}

/* .inv { */
/* position: absolute; */

/* bottom: 15px; */
/* } */
</style>
