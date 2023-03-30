<template>
  <div class="container">
    <made-item v-if="success" v-bind:game="success" />
    <div v-else>
      <h1>Create your own game</h1>
      <!-- <form> -->
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
      <button class="btn btn-lg" @click="submit">Submit</button>
      <!-- </form> -->
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
    };
  },
  methods: {
    blobToBase64(blob) {
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    },
    async onFileSelected(e, index) {
      console.log(index);
      const imageFile = e.target.files[0];
      console.log("originalFile instanceof Blob", imageFile instanceof Blob); // true
      console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(imageFile, options);
        console.log("compressedFile instanceof Blob", compressedFile instanceof Blob); // true
        console.log(`compressedFile size ${compressedFile.size / 1024} KB`); // smaller than maxSizeMB

        this.quests[index].hint = await this.blobToBase64(compressedFile); // write your own logic
        // this.quests[index].hint = compressedFile; // write your own logic
        // console.log(compressedFile);
      } catch (error) {
        console.log(error);
      }
    },
    addRow(e) {
      e.preventDefault();

      this.quests.push({
        title: "",
        clue: "",
        hint: "",
      });
    },
    deleteRow(index) {
      // e.preventDefault();
      this.quests.splice(index, 1);
    },
    submit() {
      const formData = new FormData();
      formData.append("gameMaker", this.gameMaker);
      formData.append("event", this.event);
      formData.append("gameDuration", this.gameDuration);
      formData.append("success", this.success);

      this.quests.forEach((quest) => {
        formData.append(`quests[]`, JSON.stringify(quest));
      });
      // console.log(formData.get("gameMaker"));
      // console.log(formData.getAll("quests[]"));
      axios
        .post("/api/game", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.success) {
            this.success = res.data.success;
          } else {
            alert("There was an error");
          }
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
  /* width: 100%; */
  max-width: 300px;
  margin: 15px auto;
  border-radius: 2px;
  padding: 10px 20px;
  background: #2a2826;
}
.make-image-select {
  /* height: 100px; */
  flex-direction: column;
  gap: 40px;
  color: #757575;
  font-size: 18px;
  font-weight: bold;
  /* justify-content: space-between; */
  /* align-items: center; */
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
</style>
