<template>
<div>
  <div v-if="toggle">
    <Barcode v-on:toggle="onToggle" @result="gotResult"/>
  </div>
  <div class="container" v-else>
    <div>
      <h1>Quests</h1>  
      <ul class="instru"> <li>To read the secret code, press the "Investigate" button.</li></ul>

      <div class="quests" v-if="quests[0]">
        <ol>
          <li v-for="(quest, index) in quests" :key="index" class="quest" :class="{'is-completed': quest.completed}">
            <span :class="{'not-yet': (!quest.completed && index !== state)}">{{quest.title}}</span>
          </li>
        </ol>
        <div class="clue">
          <span>Clue:</span>
          <p>{{quests[state].clue}}</p>
        </div>
        <button class="inv btn btn-lg" type="button" v-on:click="onToggle">Investigate</button>
      </div>
      <div v-else>
        <div class="no-game">{{game}}</div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Barcode from '../components/Barcode.vue'
import axios from 'axios'

export default {
  components: {
    Barcode
  },
  name: "Quest",
  data() {
    return {
      toggle: false,
      game: "loading...",
      quests: [],
      state: 0
    }
  },
  methods: {
    onToggle () {
      this.toggle = !this.toggle;
    },
    checkGameState () {
      if (this.quests.filter(quest => !quest.completed).length === 0)
      // if (this.state === this.quests.length) {
        alert("That's it! You are soooo Clutch!");
      // }
    },
    gotResult (result) {
      this.quests.map(quest => {
        if( quest._id === result && !quest.completed && this.quests.indexOf(quest) === this.state ) {
          quest.completed = true;

          if (this.state < this.quests.length && this.state !== this.quests.length - 1)
            this.state++;
        }
      });
      this.onToggle();
      this.checkGameState();
    }
  },
  created() {
    axios.get(`/game?event=${this.$route.query.event}`)
      .then(res => {
        if (res.data)
          this.quests = res.data.quests;
        else
          this.game = "Looks like there aren't any games at the moment. 😔";
      })
      // .catch(this.game = "#err")
  }
}
</script>

<style scoped>
.no-game {
  margin: 100px 50px;
  text-align: center;
  font-size: 24px;
}

.quest {
  padding: 10px 10px;
}
.not-yet {
  opacity: .5;
  color: #7c7671;
  background-color: #7c7671;
}
.instru {
  padding-left: 10px;
  opacity: .4;
}
.is-completed::after {
  content: " ✔";
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
