<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <Barcode /> -->
    <!-- <Main /> -->
    <Quest />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import Main from './components/Main.vue'
import Quest from './components/Quest.vue'

export default {
  name: 'app',
  components: {
    // Main,
    // Barcode,
    Quest
  }
}
</script>

<style>
body {
  margin: 10px;
  color: white;
  background-color: #2a2826;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  color: white;
  /* margin-top: 60px; */
}

h1 { font-family: Raleway; font-size: 36px; font-style: normal; font-variant: normal; font-weight: 700; line-height: 26.4px; } 
h3 { font-family: Raleway; font-size: 14px; font-style: normal; font-variant: normal; font-weight: 700; line-height: 15.4px; } 
p { font-family: Raleway; font-size: 14px; font-style: normal; font-variant: normal; font-weight: 400; line-height: 20px; } 
blockquote { font-family: Raleway; font-size: 21px; font-style: normal; font-variant: normal; font-weight: 400; line-height: 30px; } 
pre { font-family: Raleway; font-size: 13px; font-style: normal; font-variant: normal; font-weight: 400; line-height: 18.5714px; }
</style>
