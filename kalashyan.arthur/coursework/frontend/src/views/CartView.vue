<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { api } from '../api.js'
import QuantityControl from '../components/QuantityControl.vue'
import { cartQuantity, cartTotal, changeQuantity, clearCart, removeFromCart, store } from '../store.js'

const activeTab = ref('cart')
const orders = ref([])
const loadingOrders = ref(false)
const successMessage = ref('')
const form = reactive({ email: '', phone: '', delivery: 'pickup', address: '', payment: 'card', packaging: false })
const errors = reactive({ email: '', phone: '', address: '' })

const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
const formattedOrders = computed(() => orders.value.map((order) => ({
  ...order,
  formattedDate: new Intl.DateTimeFormat('ru-RU').format(new Date(order.date)),
  itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0)
})))

const loadOrders = async () => {
  activeTab.value = 'history'
  loadingOrders.value = true
  try {
    orders.value = await api('/orders')
  } finally {
    loadingOrders.value = false
  }
}

const validate = () => {
  errors.email = form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Проверьте адрес электронной почты' : ''
  errors.phone = form.phone.replace(/\D/g, '').length < 11 ? 'Введите номер телефона' : ''
  errors.address = form.delivery === 'delivery' && !form.address.trim() ? 'Введите адрес доставки' : ''
  return !errors.email && !errors.phone && !errors.address
}

const submitOrder = async () => {
  successMessage.value = ''
  if (!validate()) return
  const order = await api('/orders', {
    method: 'POST',
    body: JSON.stringify({
      items: store.cart,
      total: cartTotal.value,
      customer: { ...form }
    })
  })
  clearCart()
  successMessage.value = `Заказ № ${order.id} успешно оформлен`
  orders.value.unshift(order)
}

const clearAll = () => clearCart()

onMounted(async () => {
  orders.value = await api('/orders')
})
</script>

<template>
  <div class="cart-page">
    <div class="section-container">
      <div class="cart-tabs">
        <button :class="{ active: activeTab === 'cart' }" type="button" @click="activeTab = 'cart'">Корзина</button>
        <button :class="{ active: activeTab === 'history' }" type="button" @click="loadOrders">История заказов</button>
      </div>

      <template v-if="activeTab === 'cart'">
        <div v-if="successMessage" class="order-success" role="status">
          <span>✓</span>
          <div><h1>Спасибо за покупку!</h1><p>{{ successMessage }}. Информация о нем сохранена в истории заказов</p></div>
        </div>
        <section v-else-if="store.cart.length" class="cart-card">
          <div class="cart-card-head">
            <strong>{{ cartQuantity }} товаров</strong>
            <button class="text-button" type="button" @click="clearAll">Удалить все</button>
          </div>
          <article v-for="item in store.cart" :key="item.id" class="cart-row">
            <div class="cart-product-image"><img :src="item.image" :alt="item.name"></div>
            <h2>{{ item.name }}</h2>
            <QuantityControl :quantity="item.quantity" @decrease="changeQuantity(item.id, -1)" @increase="changeQuantity(item.id, 1)" />
            <strong>{{ formatPrice(item.price * item.quantity) }}</strong>
            <button class="delete-button" type="button" @click="removeFromCart(item.id)"><span>×</span>Удалить</button>
          </article>
          <div class="cart-total">{{ cartQuantity }} товаров на <strong>{{ formatPrice(cartTotal) }}</strong></div>
        </section>
        <section v-else-if="!successMessage" class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h1>В корзине пока пусто</h1>
          <p>Загляните в каталог — там собраны интересные гаджеты</p>
          <RouterLink class="primary-button" to="/catalog">Перейти в каталог</RouterLink>
        </section>

        <section v-if="store.cart.length" class="checkout-section">
          <h1>Оформление заказа</h1>
          <form class="checkout-form" novalidate @submit.prevent="submitOrder">
            <div class="checkout-panel">
              <label>
                <span>Email</span>
                <input v-model="form.email" :class="{ invalid: errors.email }" type="email" placeholder="example@mail.ru">
                <small v-if="errors.email">{{ errors.email }}</small>
              </label>
              <label>
                <span>Телефон *</span>
                <input v-model="form.phone" :class="{ invalid: errors.phone }" type="tel" placeholder="+7 999 000-00-00">
                <small v-if="errors.phone">{{ errors.phone }}</small>
              </label>
              <div class="radio-group">
                <label><input v-model="form.delivery" value="pickup" type="radio">Самовывоз</label>
                <label><input v-model="form.delivery" value="delivery" type="radio">Доставка</label>
              </div>
              <label v-if="form.delivery === 'delivery'" class="wide-field">
                <span>Адрес доставки *</span>
                <input v-model="form.address" :class="{ invalid: errors.address }" type="text" placeholder="Город, улица, дом, квартира">
                <small v-if="errors.address">{{ errors.address }}</small>
              </label>
              <label>
                <span>Способ оплаты</span>
                <select v-model="form.payment"><option value="card">Картой при получении</option><option value="cash">Наличными</option></select>
              </label>
              <label class="check-label packaging"><input v-model="form.packaging" type="checkbox"><span>Подарочная упаковка</span></label>
              <button class="primary-button checkout-button" type="submit">Оформить заказ</button>
            </div>
          </form>
        </section>
      </template>

      <section v-else class="orders-card">
        <p v-if="loadingOrders">Загружаем историю…</p>
        <div v-else-if="formattedOrders.length" class="orders-list">
          <article v-for="order in formattedOrders" :key="order.id">
            <strong>№ {{ order.id }} от {{ order.formattedDate }}</strong>
            <span>{{ order.itemCount }} шт.</span>
            <strong>{{ formatPrice(order.total) }}</strong>
          </article>
        </div>
        <div v-else class="empty-results"><h2>Заказов пока нет</h2><p>После оформления они появятся здесь</p></div>
      </section>
    </div>
  </div>
</template>
