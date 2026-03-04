<template>
  <div class="container">
    <made-item v-if="success" :game="success" />
    <div v-else>
      <h1>Create your own game</h1>
      <h2>General</h2>
      <div class="make-input-div">
        <input class="make-input" type="text" v-model="event" placeholder="Game name" />
      </div>
      <div class="make-input-div">
        <input class="make-input" type="text" v-model="gameMaker" placeholder="Your name" />
      </div>
      <div class="make-input-div">
        <input class="make-input" type="text" v-model="gameDuration" placeholder="Game duration eg: 1.5h, 30m" />
      </div>

      <div v-if="errors.length" class="error-list">
        <p v-for="(err, i) in errors" :key="i" class="error-msg">{{ err }}</p>
      </div>

      <hr />
      <h2>Quests</h2>
      <div v-for="(quest, index) in quests" :key="index">
        <div class="make-input-div">
          <input class="make-input" type="text" v-model="quest.title" placeholder="Title" />
        </div>
        <div class="make-input-div">
          <textarea class="make-input" v-model="quest.clue" placeholder="Clue" />
        </div>
        <div class="make-input-div make-image-select">
          <div>Hint (optional)</div>
          <input type="file" accept="image/png, image/gif, image/jpeg" @change="onFileSelected($event, index)" />
        </div>
        <button class="btn btn-sm del" @click="deleteRow(index)">- del</button>
      </div>
      <button class="btn btn-sm add" @click="addRow"><span>+ </span> add</button>
      <button class="btn btn-lg" @click="submit" :disabled="submitting">
        {{ submitting ? "Submitting..." : "Submit" }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MadeItem from "../components/MadeItem.vue";
import imageCompression from "browser-image-compression";
export default {
  components: {
    MadeItem,
  },
  name: "MakeView",
  data() {
    return {
      quests: [],
      gameMaker: "",
      event: "",
      gameDuration: "",
      success: false,
      errors: [],
      submitting: false,
    };
  },
  methods: {
    blobToBase64(blob) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    },
    async onFileSelected(e, index) {
      const imageFile = e.target.files[0];
      if (!imageFile) return;

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(imageFile, options);
        this.quests[index].hint = await this.blobToBase64(compressedFile);
      } catch (error) {
        console.error("Image compression failed:", error);
      }
    },
    addRow(e) {
      e.preventDefault();
      this.quests.push({ title: "", clue: "", hint: "" });
    },
    deleteRow(index) {
      this.quests.splice(index, 1);
    },
    validate() {
      const errs = [];
      if (!this.event.trim()) errs.push("Game name is required.");
      if (!this.gameMaker.trim()) errs.push("Your name is required.");
      if (!this.gameDuration.trim()) errs.push("Game duration is required.");
      if (this.quests.length === 0) errs.push("Add at least one quest.");
      this.quests.forEach((quest, i) => {
        if (!quest.title.trim()) errs.push(`Quest ${i + 1} is missing a title.`);
        if (!quest.clue.trim()) errs.push(`Quest ${i + 1} is missing a clue.`);
      });
      return errs;
    },
    submit() {
      this.errors = this.validate();
      if (this.errors.length) return;

      this.submitting = true;
      const formData = new FormData();
      formData.append("gameMaker", this.gameMaker);
      formData.append("event", this.event);
      formData.append("gameDuration", this.gameDuration);

      this.quests.forEach((quest) => {
        formData.append("quests[]", JSON.stringify(quest));
      });

      axios
        .post("/api/game", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.success) {
            this.success = res.data.success;
          } else {
            this.errors = ["Game creation failed. Please try again."];
          }
        })
        .catch(() => {
          this.errors = ["Network error. Please check your connection and try again."];
        })
        .finally(() => {
          this.submitting = false;
        });
    },
  },
};
</script>

<style scoped>
.btn-sm.del {
  margin: -6px 6px;
}
.btn-sm.add {
  float: right;
  margin-bottom: 40px;
}
.make-input-div {
  position: relative;
  display: flex;
  flex-direction: row;
  max-width: 300px;
  margin: 15px auto;
  border-radius: 2px;
  padding: 10px 20px;
  background: #2a2826;
}
.make-image-select {
  flex-direction: column;
  gap: 40px;
  color: #757575;
  font-size: 18px;
  font-weight: bold;
}
.make-input-div input {
  flex-grow: 1;
  width: 100%;
  color: white;
  font-size: 20px;
  line-height: 2.4rem;
  vertical-align: middle;
}
.make-input-div textarea {
  color: inherit;
  width: 100%;
  font-size: 20px;
  height: 3em;
}
.make-input {
  border-style: none;
  background: transparent;
  outline: none;
}
.error-list {
  max-width: 300px;
  margin: 0 auto;
}
.error-msg {
  color: #ff6b6b;
  font-size: 0.9em;
  margin: 4px 0;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
