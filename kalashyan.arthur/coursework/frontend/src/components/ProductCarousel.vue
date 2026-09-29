<script setup>
import { computed, ref } from 'vue'
import ProductCard from './ProductCard.vue'

const props = defineProps({
  title: { type: String, required: true },
  text: { type: String, required: true },
  icon: { type: String, required: true },
  products: { type: Array, required: true }
})

const position = ref(0)
const visible = computed(() => Array.from({ length: Math.min(3, props.products.length) }, (_, index) => props.products[(position.value + index) % props.products.length]))
const move = (direction) => {
  position.value = (position.value + direction + props.products.length) % props.products.length
}
</script>

<template>
  <section class="carousel-section">
    <div class="carousel-intro">
      <span class="section-icon">{{ icon }}</span>
      <h2>{{ title }}</h2>
      <p>{{ text }}</p>
    </div>
    <button class="carousel-arrow left" type="button" :aria-label="`Предыдущие товары: ${title}`" @click="move(-1)">‹</button>
    <div class="carousel-products">
      <ProductCard v-for="product in visible" :key="product.id" :product="product" />
    </div>
    <button class="carousel-arrow right" type="button" :aria-label="`Следующие товары: ${title}`" @click="move(1)">›</button>
  </section>
</template>
