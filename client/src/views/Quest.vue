<template>
<div>
  <div v-if="toggle">
    <Barcode v-on:toggle="onToggle" />
  </div>
  <div class="todo" v-else>
    <div >
      <h1>Quests</h1>  
      <ul class="instru"> <li>To read the secret code, press the "Investigate" button.</li></ul>

      <div class="quests">
        <ol>
          <li v-for="(quest, index) in quests" :key="index" class="quest" :class="{'is-completed': quest.completed}">{{quest.title}}</li>
        </ol>
        <div class="clue">
          <span>Clue:</span>
          <p>{{quests[0].clue}}</p>
        </div>
        <button class="inv btn btn-lg" type="button" v-on:click="onToggle">Investigate</button>
      </div>
    </div>
    
  </div>
  </div>
</template>

<script>
import Barcode from '../components/Barcode.vue'

export default {
  components: {
    Barcode
  },
  name: "Quest",
  data() {
    return {
      toggle: false,
      quests: [
        {
          id: 1,
          title: "boop",
          clue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tincidunt justo sed tortor placerat, eget semper risus molestie. Sed ac orci posuere augue pellentesque ultricies. Pellentesque luctus venenatis lorem sed vehicula.",
          completed: true
        },
        {
          id: 2,
          title: "piddie",
          clue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tincidunt justo sed tortor placerat, eget semper risus molestie. Sed ac orci posuere augue pellentesque ultricies. Pellentesque luctus venenatis lorem sed vehicula.",
          completed: true
        },
        {
          id: 3,
          title: "scoop",
          clue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tincidunt justo sed tortor placerat, eget semper risus molestie. Sed ac orci posuere augue pellentesque ultricies. Pellentesque luctus venenatis lorem sed vehicula.",
          completed: false
        },

      ]
    }
  },
  methods: {
    onToggle () {
      this.toggle = !this.toggle;
    }
  },
}
</script>

<style scoped>

.todo {
  margin: 10px auto;
  padding: 5px 20px;
  border-radius: 2px;
  /* padding-bottom: 50px; */
  background-color: #F7F7F722;  
  max-width: 480px;

}
.quest {
  padding: 10px 10px;
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
