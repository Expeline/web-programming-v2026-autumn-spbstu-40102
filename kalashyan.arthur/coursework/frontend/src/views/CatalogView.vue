<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import ProductModal from '../components/ProductModal.vue'
import { loadGoods, store } from '../store.js'

const sort = ref('new')
const page = ref(1)
const perPage = 6
const selectedProduct = ref(null)
const draft = reactive({ min: '', max: '', types: [], colors: [] })
const filters = reactive({ min: '', max: '', types: [], colors: [] })

onMounted(loadGoods)

const types = computed(() => [...new Set(store.goods.map((item) => item.type))])
const colors = computed(() => [...new Set(store.goods.map((item) => item.color))])
const filteredProducts = computed(() => {
  const result = store.goods.filter((product) => {
    const matchesMin = filters.min === '' || product.price >= Number(filters.min)
    const matchesMax = filters.max === '' || product.price <= Number(filters.max)
    const matchesType = !filters.types.length || filters.types.includes(product.type)
    const matchesColor = !filters.colors.length || filters.colors.includes(product.color)
    return matchesMin && matchesMax && matchesType && matchesColor
  })
  return result.sort((first, second) => {
    if (sort.value === 'popular') return second.popularity - first.popularity
    if (sort.value === 'cheap') return first.price - second.price
    if (sort.value === 'expensive') return second.price - first.price
    return Number(second.isNew) - Number(first.isNew) || second.id - first.id
  })
})
const pageCount = computed(() => Math.ceil(filteredProducts.value.length / perPage))
const visibleProducts = computed(() => filteredProducts.value.slice((page.value - 1) * perPage, page.value * perPage))
const pageNumbers = computed(() => {
  if (pageCount.value <= 4) return Array.from({ length: pageCount.value }, (_, index) => index + 1)
  if (page.value <= 3) return [1, 2, 3, '…', pageCount.value]
  if (page.value >= pageCount.value - 2) return [1, '…', pageCount.value - 2, pageCount.value - 1, pageCount.value]
  return [1, '…', page.value, '… ', pageCount.value]
})

const applyFilters = () => {
  Object.assign(filters, { min: draft.min, max: draft.max, types: [...draft.types], colors: [...draft.colors] })
  page.value = 1
}

const resetFilters = () => {
  Object.assign(draft, { min: '', max: '', types: [], colors: [] })
  Object.assign(filters, { min: '', max: '', types: [], colors: [] })
  page.value = 1
}

watch(sort, () => { page.value = 1 })
</script>

<template>
  <div class="catalog-page section-container">
    <div class="catalog-main">
      <h1>Каталог товаров</h1>
      <div class="sort-tabs" aria-label="Сортировка товаров">
        <button v-for="option in [{ value: 'new', label: 'Новые' }, { value: 'popular', label: 'Популярные' }, { value: 'cheap', label: 'Подешевле' }, { value: 'expensive', label: 'Подороже' }]" :key="option.value" :class="{ active: sort === option.value }" type="button" @click="sort = option.value">{{ option.label }}</button>
      </div>
      <div v-if="visibleProducts.length" class="catalog-grid">
        <ProductCard v-for="product in visibleProducts" :key="product.id" :product="product" actions @open="selectedProduct = $event" />
      </div>
      <div v-else class="empty-results">
        <h2>Товары не найдены</h2>
        <p>Попробуйте изменить параметры фильтра</p>
      </div>
      <nav v-if="pageCount > 1" class="pagination" aria-label="Страницы каталога">
        <button v-for="number in pageNumbers" :key="number" :class="{ active: number === page, dots: typeof number !== 'number' }" :disabled="typeof number !== 'number'" type="button" @click="page = number">{{ number }}</button>
        <button class="next-page" type="button" aria-label="Следующая страница" :disabled="page === pageCount" @click="page += 1">›</button>
      </nav>
    </div>
    <aside class="filters">
      <fieldset>
        <legend>Цена, ₽</legend>
        <div class="price-fields">
          <label><span>От</span><input v-model="draft.min" min="0" type="number" placeholder="0"></label>
          <label><span>До</span><input v-model="draft.max" min="0" type="number" placeholder="100000"></label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Тип товара</legend>
        <label v-for="type in types" :key="type" class="check-label"><input v-model="draft.types" :value="type" type="checkbox"><span>{{ type }}</span></label>
      </fieldset>
      <fieldset>
        <legend>Цвет</legend>
        <label v-for="color in colors" :key="color" class="check-label"><input v-model="draft.colors" :value="color" type="checkbox"><span>{{ color }}</span></label>
      </fieldset>
      <div class="filter-actions">
        <button class="primary-button" type="button" @click="applyFilters">Показать</button>
        <button class="text-button" type="button" @click="resetFilters">Сбросить</button>
      </div>
    </aside>
    <ProductModal v-if="selectedProduct" :product="selectedProduct" @close="selectedProduct = null" />
  </div>
</template>
