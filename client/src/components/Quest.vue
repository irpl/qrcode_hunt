<template>
  <div class="todo">
    <h1>Quests</h1>  
    <ul class="instru"> <li>Read the clue. Find the secret code. Press the "Invetigate" button to read the code.</li></ul>

    <div class="quests">
      <ol>
        <li v-for="(quest, index) in quests" :key="index" class="quest" :class="{'is-completed': quest.completed}">{{quest.title}}</li>
      </ol>
      <div class="clue">
        <span>Clue:</span>
        <p>{{quests[0].clue}}</p>
      </div>
      <button class="inv btn btn-lg btn-primary btn-block btn-signin" type="button">Investigate</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Quests",
  data() {
    return {
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
  }
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
.btn {
  color: inherit;
  font-weight: 700;
  height: 72px;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
  background-color: #2a2826;
  padding: 0px;
  font-family: Raleway;
  font-weight: 700;
  font-size: 20px;
  /* height: 36px; */
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  border-radius: 3px;
  border: none;
  -o-transition: all 0.218s;
  -moz-transition: all 0.218s;
  -webkit-transition: all 0.218s;
  transition: all 0.218s;
}
.btn.btn-signin:hover,
.btn.btn-signin:active,
.btn.btn-signin:focus {
    background-color: #7c7671;
}

.clue {
  margin: 50px 0;
}

/* .inv { */
  /* position: absolute; */
  
  /* bottom: 15px; */
/* } */
</style>
