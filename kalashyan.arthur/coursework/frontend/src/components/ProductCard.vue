<script setup>
import { computed } from 'vue'
import { addToCart, cartItem, changeQuantity } from '../store.js'
import QuantityControl from './QuantityControl.vue'

const props = defineProps({
  product: { type: Object, required: true },
  actions: { type: Boolean, default: false }
})

defineEmits(['open'])

const item = computed(() => cartItem(props.product.id))
const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
</script>

<template>
  <article class="product-card" tabindex="0" @click="$emit('open', product)" @keydown.enter="$emit('open', product)">
    <div class="product-image-wrap">
      <span v-if="product.isNew" class="product-label">Новинка</span>
      <img :src="product.image" :alt="product.name">
    </div>
    <div class="product-rating"><span>★</span> {{ product.rating }}</div>
    <h3>{{ product.name }}</h3>
    <div class="product-card-bottom">
      <strong>{{ formatPrice(product.price) }}</strong>
      <button v-if="actions && !item" class="icon-cart-button" type="button" aria-label="Добавить товар в корзину" @click.stop="addToCart(product)">В корзину</button>
      <QuantityControl v-if="actions && item" :quantity="item.quantity" @decrease="changeQuantity(product.id, -1)" @increase="changeQuantity(product.id, 1)" />
    </div>
  </article>
</template>
