import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Quest from './views/Quest.vue'
import Make from './views/Make.vue'
import About from './views/About.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/quest',
      name: 'quest',
      component: Quest
    },
    {
      path: '/make',
      name: 'make',
      component: Make
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})