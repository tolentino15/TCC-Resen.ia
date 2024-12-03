
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FeedbackView from '../views/feedbackView.vue'
import ConfigView from '../views/ConfigView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/feedbacks',
    name: 'feedbacks',
    component: FeedbackView,
  },{
    path: '/Config',
    name: 'Config',
    component: ConfigView,  
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
