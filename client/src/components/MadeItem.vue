<template>
  <div>
    <h1>Your game has been made</h1>

    <p>You'll use this QR-Code to start your game.</p>
    <div class="made-qr">
      <img v-bind:src="'https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=35&data=' + game.event" />
    </div>

    <p>Print and hide these QR-Codes for your friends to find.</p>
    <div class="made-qr" v-for="(quest, index) in game.quests" :key="index">
      <div>{{ index + 1 }}. {{ quest.clue }}</div>
      <br />
      <img v-bind:src="'https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=35&data=' + quest._id" />
    </div>
  </div>
</template>

<script>
export default {
  name: "MadeItem",
  props: ["game"],
};
</script>

<style>
.made-qr {
  width: 45%;
  display: inline-block;
  padding: 2.5% 2.5%;
}

.made-qr > img {
  width: 100%;
}
</style>
