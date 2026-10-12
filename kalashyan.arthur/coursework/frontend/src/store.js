import { computed, reactive } from 'vue'
import { api } from './api.js'

const savedCart = JSON.parse(localStorage.getItem('gadgetHubCart') || '[]')

export const store = reactive({
  authenticated: false,
  user: null,
  goods: [],
  cart: savedCart,
  ready: false
})

let initialization

export const ensureInitialized = () => {
  if (!initialization) {
    initialization = api('/session')
      .then((session) => {
        store.authenticated = session.authenticated
        store.user = session.user
      })
      .catch(() => {})
      .finally(() => {
        store.ready = true
      })
  }
  return initialization
}

export const login = async (username, password) => {
  const result = await api('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })
  store.authenticated = true
  store.user = result.user
}

export const logout = async () => {
  await api('/logout', { method: 'POST' })
  store.authenticated = false
  store.user = null
}

export const loadGoods = async () => {
  if (!store.goods.length) {
    store.goods = await api('/goods')
  }
  return store.goods
}

const saveCart = () => localStorage.setItem('gadgetHubCart', JSON.stringify(store.cart))

export const cartQuantity = computed(() => store.cart.reduce((sum, item) => sum + item.quantity, 0))
export const cartTotal = computed(() => store.cart.reduce((sum, item) => sum + item.price * item.quantity, 0))

export const cartItem = (id) => store.cart.find((item) => item.id === id)

export const addToCart = (product) => {
  const item = cartItem(product.id)
  if (item) {
    item.quantity += 1
  } else {
    store.cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 })
  }
  saveCart()
}

export const changeQuantity = (id, difference) => {
  const item = cartItem(id)
  if (!item) return
  item.quantity += difference
  if (item.quantity < 1) removeFromCart(id)
  saveCart()
}

export const removeFromCart = (id) => {
  store.cart = store.cart.filter((item) => item.id !== id)
  saveCart()
}

export const clearCart = () => {
  store.cart = []
  saveCart()
}
