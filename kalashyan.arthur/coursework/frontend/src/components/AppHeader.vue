<script setup>
import { useRouter } from 'vue-router'
import { cartQuantity, logout, store } from '../store.js'

const router = useRouter()

const signOut = async () => {
  await logout()
  router.push('/')
}
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink class="logo" to="/" aria-label="Gadget Hub, на главную">
        <span>Gadget</span> Hub
      </RouterLink>
      <nav class="main-nav" aria-label="Основная навигация">
        <RouterLink v-if="store.authenticated" to="/catalog">
          <img src="/assets/images/icons/catalog.svg" alt="">
          Каталог
        </RouterLink>
        <RouterLink v-if="store.authenticated" class="cart-link" to="/cart">
          <img src="/assets/images/icons/card.svg" alt="">
          Корзина
          <span v-if="cartQuantity" class="cart-badge">{{ cartQuantity }}</span>
        </RouterLink>
        <RouterLink v-if="!store.authenticated" to="/login">
          <img src="/assets/images/icons/profile.svg" alt="">
          Войти
        </RouterLink>
        <button v-else class="nav-button" type="button" @click="signOut">
          <img src="/assets/images/icons/profile.svg" alt="">
          Выйти
        </button>
      </nav>
    </div>
  </header>
</template>
