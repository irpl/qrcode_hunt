<template>
  <div>
    <div class="container">
      <form>
        <div class="make-input-div">
          <input class="make-input" type="text" v-model="event" placeholder="Game name"/>
        </div>
        <div class="make-input-div">
          <input class="make-input" type="text" v-model="gameMaker" placeholder="Your name"/>
        </div>
        <div v-for="(quests, index) in quests" :key="index">
          Title: <input type="text" v-model="quests.title" /> 
          Clue: <textarea v-model="quests.clue" />
          <button @click="deleteRow(index)">Delete</button>
        </div>
        <button class="btn btn-lg" @click="addRow">Add row</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      quests: [],
      gameMaker: '',
      event: ''
    }
  },
  methods: {
    addRow(e) {
      e.preventDefault();
      
      this.quests.push({
        title: '',
        clue: ''
      })
    },
    deleteRow(index) {
      this.inputs.splice(index,1)
    }
  }
}
</script>

<style>
.make-input-div {
    position: relative;
    display: flex;
    flex-direction: row;
    /* width: 100%; */
    max-width: 300px;
    margin: 15px auto;
    border-radius: 2px;
    padding: 1.4rem 2rem 1.6rem;
    background: #2a2826;
}
.make-input-div input {
    flex-grow: 1;
    width: 100%;
    color: white;
    font-size: 1.8rem;
    line-height: 2.4rem;
    vertical-align: middle;
}
.make-input {
    border-style: none;
    background: transparent;
    outline: none;
}
</style>
