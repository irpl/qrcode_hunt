<template>
  <div class="main">
    <div v-if="toggle">
      <Barcode v-on:toggle="onToggle" @result="gotResult" />
    </div>
    <div class="card card-container" v-else>
      <h3>This is sooo</h3>
      <h1>CLUTCH</h1>
      <!-- <div class="logo"></div> -->
      <!-- <router-link to="/quest" tag="button" class="btn btn-lg" type="submit">New game</router-link> -->
      <button @click="ifContinu" v-if="continu" class="btn btn-lg">Continue</button>
      <button @click="ifNu" class="btn btn-lg">New game</button>
    </div>
  </div>
</template>

<script>
import Barcode from "../components/Barcode.vue";
export default {
  components: {
    Barcode,
  },
  name: "Home",
  data() {
    return {
      continu: false,
      toggle: false,
    };
  },
  methods: {
    onToggle() {
      this.toggle = !this.toggle;
    },
    gotResult(result) {
      localStorage.setItem("startTime", Date.now());
      this.$router.push({ path: "quest", query: { event: result } });
    },
    ifNu() {
      localStorage.setItem("state", "0");
      this.onToggle();
    },
    ifContinu() {
      let gameName = localStorage.getItem("gameName");
      this.$router.push({ path: "quest", query: { event: gameName } });
    },
  },
  created() {
    if (localStorage.getItem("game") === "1") {
      this.continu = true;
    }
  },
};
</script>

<style scoped>
h1 {
  font-size: 3em;
}

.logo {
  height: 40px;
}

.card-container.card {
  max-width: 300px;
  padding: 40px 40px;
}
.card {
  text-align: center;
  background-color: #f7f7f722;
  /* just in case there no content*/
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 15%;
  /* shadows and rounded borders */
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}
</style>
