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
const direction = ref(0)
const moving = ref(false)
const visible = computed(() => props.products.length ? Array.from({ length: Math.min(3, props.products.length) + 2 }, (_, index) => props.products[(position.value + index - 1 + props.products.length) % props.products.length]) : [])
const move = (step) => {
  if (moving.value || props.products.length < 2) return
  moving.value = true
  direction.value = step
}
const finishMove = () => {
  position.value = (position.value + direction.value + props.products.length) % props.products.length
  moving.value = false
  direction.value = 0
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
    <div class="carousel-products" :style="{ width: `${Math.max(0, Math.min(3, products.length) * 318 - 32)}px` }">
      <div class="carousel-track" :class="{ moving }" :style="{ transform: `translateX(${-318 * (direction + 1)}px)` }" @transitionend.self="finishMove">
        <ProductCard v-for="(product, index) in visible" :key="index" :product="product" :inert="index === 0 || index === visible.length - 1" :aria-hidden="index === 0 || index === visible.length - 1 ? true : undefined" />
      </div>
    </div>
    <button class="carousel-arrow right" type="button" :aria-label="`Следующие товары: ${title}`" @click="move(1)">›</button>
  </section>
</template>
