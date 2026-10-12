<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { addToCart, cartItem, changeQuantity } from '../store.js'
import QuantityControl from './QuantityControl.vue'

const props = defineProps({ product: { type: Object, required: true } })
const emit = defineEmits(['close'])
const item = computed(() => cartItem(props.product.id))
const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
const handleKey = (event) => event.key === 'Escape' && emit('close')

onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => window.removeEventListener('keydown', handleKey))
</script>

<template>
  <div class="modal-backdrop" role="presentation" @mousedown.self="$emit('close')">
    <section class="product-modal" role="dialog" aria-modal="true" :aria-label="product.name">
      <button class="modal-close" type="button" aria-label="Закрыть карточку" @click="$emit('close')">×</button>
      <div class="modal-image"><img :src="product.image" :alt="product.name"></div>
      <div class="modal-details">
        <div class="product-rating"><span>★</span> {{ product.rating }}</div>
        <h2>{{ product.name }}</h2>
        <p>{{ product.description }}</p>
        <h3>Характеристики</h3>
        <dl>
          <template v-for="(value, name) in product.characteristics" :key="name">
            <dt>{{ name }}</dt>
            <dd>{{ value }}</dd>
          </template>
        </dl>
        <div class="modal-buy">
          <strong>{{ formatPrice(product.price) }}</strong>
          <button v-if="!item" class="primary-button" type="button" @click="addToCart(product)">Добавить в корзину</button>
          <QuantityControl v-else :quantity="item.quantity" @decrease="changeQuantity(product.id, -1)" @increase="changeQuantity(product.id, 1)" />
        </div>
      </div>
    </section>
  </div>
</template>
