<script setup>
defineProps({ quantity: { type: Number, required: true } })
defineEmits(['decrease', 'increase'])
</script>

<template>
  <div class="quantity-control">
    <button type="button" aria-label="Уменьшить количество" @click.stop="$emit('decrease')">−</button>
    <span>{{ quantity }}</span>
    <button type="button" aria-label="Увеличить количество" @click.stop="$emit('increase')">+</button>
  </div>
</template>
