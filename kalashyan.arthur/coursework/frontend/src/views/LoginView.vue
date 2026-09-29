<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../store.js'

const route = useRoute()
const router = useRouter()
const form = reactive({ username: '', password: '' })
const errors = reactive({ username: '', password: '' })
const message = ref('')
const loading = ref(false)

const submit = async () => {
  errors.username = form.username.trim() ? '' : 'Введите логин'
  errors.password = form.password ? '' : 'Введите пароль'
  message.value = ''
  if (errors.username || errors.password) return
  loading.value = true
  try {
    await login(form.username.trim(), form.password)
    router.push(typeof route.query.redirect === 'string' ? route.query.redirect : '/')
  } catch (error) {
    message.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <form class="login-card" novalidate @submit.prevent="submit">
      <h1>Добро пожаловать!</h1>
      <p>Войдите, чтобы перейти в каталог и оформить заказ</p>
      <div v-if="message" class="form-alert" role="alert">{{ message }}</div>
      <label>
        <span>Логин</span>
        <input v-model="form.username" :class="{ invalid: errors.username }" autocomplete="username" type="text" placeholder="Введите логин">
        <small v-if="errors.username">{{ errors.username }}</small>
      </label>
      <label>
        <span>Пароль</span>
        <input v-model="form.password" :class="{ invalid: errors.password }" autocomplete="current-password" type="password" placeholder="Введите пароль">
        <small v-if="errors.password">{{ errors.password }}</small>
      </label>
      <button class="primary-button" type="submit" :disabled="loading">{{ loading ? 'Входим…' : 'Войти' }}</button>
    </form>
  </div>
</template>
