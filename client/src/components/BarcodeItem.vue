<template>
  <div>
    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <qrcode-stream @decode="onDecode" @init="onInit" camera="rear">
      <button class="btn btn-sm back-btn" @click="toggle">Back</button>
    </qrcode-stream>
  </div>
</template>

<script>
import { QrcodeStream } from "vue3-qrcode-reader";
export default {
  components: {
    QrcodeStream,
  },
  data() {
    return {
      error: "",
    };
  },

  methods: {
    toggle() {
      this.$emit("toggle");
    },
    onDecode(result) {
      this.$emit("result", result);
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "Camera access was denied. Please grant permission in your browser settings.";
        } else if (error.name === "NotFoundError") {
          this.error = "No camera found on this device.";
        } else if (error.name === "NotSupportedError") {
          this.error = "Camera requires a secure connection (HTTPS). Please use HTTPS.";
        } else if (error.name === "NotReadableError") {
          this.error = "Camera is already in use by another app.";
        } else if (error.name === "OverconstrainedError") {
          this.error = "No suitable camera found on this device.";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "Camera streaming is not supported in this browser.";
        } else {
          this.error = "An unknown camera error occurred.";
        }
      }
    },
  },
};
</script>

<style scoped>
.error {
  font-weight: bold;
  color: red;
}
</style>
