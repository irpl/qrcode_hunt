<template>
  <div>
    <p class="error">{{ error }}</p>

    <!-- <p class="decode-result">Last result: <b>{{ result }}</b></p> -->

    <qrcode-stream @decode="onDecode" @init="onInit" camera="rear">
      <button class="btn btn-sm back-btn" v-on:click="toggle">Back</button>
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
      result: "",
      error: "",
    };
  },

  methods: {
    toggle() {
      this.$emit("toggle");
    },
    onDecode(result) {
      this.result = result;
      this.$emit("result", result);
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
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
