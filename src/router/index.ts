
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FeedbackView from '../views/feedbackView.vue'
import ProductsView from '../views/ProductsView.vue';

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
    path: '/produtos',
    name: 'produtos',
    component: ProductsView,  // Adicionar a rota para a página de produtos
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
