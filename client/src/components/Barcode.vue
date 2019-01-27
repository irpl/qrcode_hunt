<template>
  <div>
    <p class="error">{{ error }}</p>

    <!-- <p class="decode-result">Last result: <b>{{ result }}</b></p> -->
    <button class="btn btn-sm back-btn" v-on:click="toggle">Back</button>
    <qrcode-stream @decode="onDecode" @init="onInit" :camera="{ facingMode: 'environment', height: { min: 240, ideal: 600, max: 1080 } }" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      result: '',
      error: ''
    }
  },

  methods: {
    toggle () {
      this.$emit('toggle');
    },
    onDecode (result) {
      this.result = result
    },

    async onInit (promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = "ERROR: you need to grant camera access permisson"
        } else if (error.name === 'NotFoundError') {
          this.error = "ERROR: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          this.error = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          this.error = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          this.error = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "ERROR: Stream API is not supported in this browser"
        }
      }
    }
  }
}
</script>

<style scoped>
.error {
  font-weight: bold;
  color: red;
}
</style>