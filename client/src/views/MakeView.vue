<template>
  <div class="container">
    <made-item v-if="success" :game="success" />
    <div v-else>
      <h1 class="page-title">Create a game</h1>

      <section class="form-section">
        <h2>General</h2>
        <div class="field">
          <input class="field-input" type="text" v-model="event" placeholder="Game name" />
        </div>
        <div class="field">
          <input class="field-input" type="text" v-model="gameMaker" placeholder="Your name" />
        </div>
        <div class="field">
          <input class="field-input" type="text" v-model="gameDuration" placeholder="Duration  e.g. 1.5h, 30m" />
        </div>
      </section>

      <div v-if="errors.length" class="error-list">
        <p v-for="(err, i) in errors" :key="i" class="error-msg">⚠ {{ err }}</p>
      </div>

      <hr />

      <section class="form-section">
        <div class="quests-header">
          <h2>Quests</h2>
          <button class="btn btn-sm btn-accent" @click="addRow">+ Add quest</button>
        </div>
        <div v-for="(quest, index) in quests" :key="index" class="quest-card">
          <div class="quest-card-header">
            <span class="quest-number">Quest {{ index + 1 }}</span>
            <button class="btn btn-sm del-btn" @click="deleteRow(index)">Remove</button>
          </div>
          <div class="field">
            <input class="field-input" type="text" v-model="quest.title" placeholder="Title" />
          </div>
          <div class="field">
            <textarea class="field-input" v-model="quest.clue" placeholder="Clue" rows="3" />
          </div>
          <label class="hint-label">
            <span>Hint image (optional)</span>
            <input type="file" accept="image/png, image/gif, image/jpeg" @change="onFileSelected($event, index)" />
          </label>
          <div v-if="quest.hint" class="hint-preview-label">✔ Image attached</div>
        </div>
        <div v-if="quests.length === 0" class="no-quests">No quests yet. Add one above.</div>
      </section>

      <button class="btn btn-lg btn-accent submit-btn" @click="submit" :disabled="submitting">
        {{ submitting ? "Submitting..." : "Create game" }}
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
.page-title {
  margin-bottom: 20px;
}

.form-section {
  margin-bottom: 8px;
}

.quests-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.quests-header h2 {
  margin-bottom: 0;
}

.field {
  margin-bottom: 10px;
}

.field-input {
  width: 100%;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  font-family: 'Raleway', sans-serif;
  font-size: 15px;
  padding: 12px 14px;
  outline: none;
  transition: border-color var(--transition);
  resize: vertical;
}

.field-input:focus {
  border-color: var(--accent);
}

.field-input::placeholder {
  color: var(--text-muted);
}

.quest-card {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 12px;
}

.quest-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.quest-number {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--accent);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.del-btn {
  opacity: 0.6;
  font-size: 12px;
}

.del-btn:hover {
  opacity: 1;
  color: var(--error);
  border-color: var(--error);
}

.hint-label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-top: 8px;
}

.hint-preview-label {
  font-size: 0.8rem;
  color: var(--success);
  margin-top: 6px;
}

.no-quests {
  text-align: center;
  color: var(--text-muted);
  padding: 24px;
  font-size: 0.9rem;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
}

.error-list {
  margin-bottom: 16px;
}

.error-msg {
  color: var(--error);
  font-size: 0.88rem;
  margin: 4px 0;
}

.submit-btn {
  margin-top: 8px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}
</style>
