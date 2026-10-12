import { createRouter, createWebHistory } from 'vue-router'
import { ensureInitialized, store } from './store.js'
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'
import CatalogView from './views/CatalogView.vue'
import CartView from './views/CartView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/catalog', name: 'catalog', component: CatalogView, meta: { requiresAuth: true } },
    { path: '/cart', name: 'cart', component: CartView, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach(async (to) => {
  await ensureInitialized()
  if (to.meta.requiresAuth && !store.authenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && store.authenticated) return { name: 'home' }
})

export default router
