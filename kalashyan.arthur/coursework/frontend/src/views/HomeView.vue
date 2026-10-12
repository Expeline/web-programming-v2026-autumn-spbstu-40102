<script setup>
import { computed, onMounted } from 'vue'
import ProductCarousel from '../components/ProductCarousel.vue'
import { loadGoods, store } from '../store.js'

onMounted(loadGoods)

const hits = computed(() => store.goods.filter((product) => product.isHit))
const newProducts = computed(() => store.goods.filter((product) => product.isNew))
</script>

<template>
  <div class="home-page">
    <section class="hero" aria-label="Большая распродажа">
      <img src="/assets/images/hero.png" alt="Super Sale — большая распродажа гаджетов">
    </section>
    <div v-if="store.goods.length" class="home-sections">
      <ProductCarousel
        title="Хиты продаж"
        icon="♥"
        text="Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надежные гаджеты!"
        :products="hits"
      />
      <ProductCarousel
        title="Новинки"
        icon="✦"
        text="Их только произвели — они уже у нас! Все самое новое и свежее на рынке электроники"
        :products="newProducts"
      />
    </div>
    <section class="advantages section-container">
      <h2>Преимущества</h2>
      <div class="advantage-grid">
        <article><span class="advantage-icon pink">➜</span><p>Утром заказали, вечером получили</p></article>
        <article><span class="advantage-icon blue">↩</span><p>С товаром что-то не так? Вернем деньги</p></article>
        <article><span class="advantage-icon green">✓</span><p>Только оригинальные товары</p></article>
      </div>
    </section>
    <section class="contacts section-container">
      <h2>Работаем 24/7</h2>
      <div class="contact-grid">
        <a href="tel:+78006783424"><span>☎</span>8 (800) 678-34-24</a>
        <a href="mailto:gadget@hub.ru"><span>✉</span>gadget@hub.ru</a>
        <p><span>●</span>Санкт-Петербург, ул. Барочная, д. 7, корпус 2</p>
      </div>
    </section>
  </div>
</template>
