<template>
  <div>
    <h1>Your game has been made</h1>

    <p>You'll use this QR-Code to start your game.</p>
    <div class="made-qr">
      <img :src="qrUrl(game.event)" :alt="'QR code to start game: ' + game.event" />
    </div>

    <p>Print and hide these QR-Codes for your friends to find.</p>
    <div class="made-qr" v-for="(quest, index) in game.quests" :key="quest._id">
      <div>{{ index + 1 }}. {{ quest.clue }}</div>
      <img :src="qrUrl(quest._id)" :alt="'QR code for quest ' + (index + 1)" />
    </div>
  </div>
</template>

<script>
export default {
  name: "MadeItem",
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  methods: {
    qrUrl(data) {
      return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=35&data=${encodeURIComponent(data)}`;
    },
  },
};
</script>

<style scoped>
.made-qr {
  width: 45%;
  display: inline-block;
  padding: 2.5% 2.5%;
}

.made-qr > img {
  width: 100%;
  display: block;
  margin-top: 8px;
}
</style>
