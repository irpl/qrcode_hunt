<template>
  <div class="container">
    <Made v-if="success" v-bind:game="success" />
    <div v-else>
      <h1>Create your own game</h1>
      <!-- <form> -->
      <h2>General</h2>
      <div class="make-input-div">
        <input class="make-input" type="text" v-model="event" placeholder="Game name" />
      </div>
      <div class="make-input-div">
        <input class="make-input" type="text" v-model="gameMaker" placeholder="Your name" />
      </div>
      <hr />
      <h2>Quests</h2>
      <div v-for="(quests, index) in quests" :key="index">
        <div class="make-input-div">
          <input class="make-input" type="text" v-model="quests.title" placeholder="Title" />
        </div>
        <div class="make-input-div">
          <textarea class="make-input" v-model="quests.clue" placeholder="Clue" />
        </div>
        <button class="btn btn-sm del" @click="deleteRow(index)">- del</button>
      </div>
      <button class="btn btn-sm add" @click="addRow"><span>+ </span> add</button>
      <button class="btn btn-lg" @click="submit">Submit</button>
      <!-- </form> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Made from "../components/Made.vue";
export default {
  components: {
    Made,
  },
  name: "Make",
  data() {
    return {
      quests: [],
      gameMaker: "",
      event: "",
      success: false,
    };
  },
  methods: {
    addRow(e) {
      e.preventDefault();

      this.quests.push({
        title: "",
        clue: "",
      });
    },
    deleteRow(index) {
      // e.preventDefault();
      this.quests.splice(index, 1);
    },
    submit() {
      axios.post("/api/game", this.$data).then((res) => {
        if (res.data.success) {
          this.success = res.data.success;
        } else {
          alert("There was an error");
        }
      });
    },
  },
};
</script>

<style scoped>
.btn-sm.del {
  margin: -6px 6px;
}
.btn-sm.add {
  float: right;
  margin-bottom: 40px;
}
.make-input-div {
  position: relative;
  display: flex;
  flex-direction: row;
  /* width: 100%; */
  max-width: 300px;
  margin: 15px auto;
  border-radius: 2px;
  padding: 10px 20px;
  background: #2a2826;
}
.make-input-div input {
  flex-grow: 1;
  width: 100%;
  color: white;
  font-size: 20px;
  line-height: 2.4rem;
  vertical-align: middle;
}
.make-input-div textarea {
  color: inherit;
  width: 100%;
  font-size: 20px;
  height: 3em;
}
.make-input {
  border-style: none;
  background: transparent;
  outline: none;
}
</style>
