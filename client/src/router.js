import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Quest from "./views/Quest.vue";
import Make from "./views/Make.vue";
import Games from "./views/Games.vue";
import About from "./views/About.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/quest",
      name: "quest",
      component: Quest,
    },
    {
      path: "/make",
      name: "make",
      component: Make,
    },
    {
      path: "/games",
      name: "game",
      component: Games,
    },
    {
      path: "/about",
      name: "about",
      component: About,
    },
  ],
});
