<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {}
}
</script>

<style>
body {
  margin: 10px;
  color: white;
  background-color: #2a2826;
}
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  font-family: Raleway;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  color: white;
  /* margin-top: 60px; */
}
.container {
  margin: 10px auto;
  padding: 5px 20px;
  border-radius: 2px;
  /* padding-bottom: 50px; */
  background-color: #F7F7F722;  
  max-width: 480px;

}
.btn {
  color: inherit;
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
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  border-radius: 3px;
  border: none;
  -o-transition: all 0.218s;
  -moz-transition: all 0.218s;
  -webkit-transition: all 0.218s;
  transition: all 0.218s;
}
.btn-lg {
  width: 100%;
  display: block;
  margin-bottom: 10px;
  z-index: 1;
  position: relative;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.back-btn {
  position: absolute;
  z-index: 1;
}
.btn-sm {
  opacity: .7;
  margin: 10px;
  height: 41px;
  width: 70px;
}
.btn:hover,
.btn:active,
.btn:focus {
    background-color: #7c7671;
    cursor: pointer;
}

/* h1 { font-family: Raleway; font-size: 36px; font-style: normal; font-variant: normal; font-weight: 700; line-height: 26.4px; } 
h3 { font-family: Raleway; font-size: 14px; font-style: normal; font-variant: normal; font-weight: 700; line-height: 15.4px; } 
p { font-family: Raleway; font-size: 14px; font-style: normal; font-variant: normal; font-weight: 400; line-height: 20px; } 
blockquote { font-family: Raleway; font-size: 21px; font-style: normal; font-variant: normal; font-weight: 400; line-height: 30px; } 
pre { font-family: Raleway; font-size: 13px; font-style: normal; font-variant: normal; font-weight: 400; line-height: 18.5714px; } */
</style>
