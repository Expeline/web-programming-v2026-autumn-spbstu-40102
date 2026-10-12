import cors from 'cors'
import express from 'express'
import session from 'express-session'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const port = 3000
const dataDirectory = join(dirname(fileURLToPath(import.meta.url)), 'data')
const goodsPath = join(dataDirectory, 'goods.json')
const ordersPath = join(dataDirectory, 'orders.json')
const credentials = { username: 'arthur', password: '12345' }

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }))
app.use(express.json())
app.use(session({
  secret: 'gadget-hub-study-project',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 }
}))

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))

const requireAuth = (request, response, next) => {
  if (!request.session.user) {
    response.status(401).json({ message: 'Необходимо войти в аккаунт' })
    return
  }
  next()
}

app.get('/api/session', (request, response) => {
  response.json({ authenticated: Boolean(request.session.user), user: request.session.user || null })
})

app.post('/api/login', (request, response) => {
  const { username, password } = request.body
  if (username !== credentials.username || password !== credentials.password) {
    response.status(401).json({ message: 'Такого пользователя нет. Возможно, введен неправильный логин или пароль — проверьте данные' })
    return
  }
  request.session.user = { username }
  response.json({ user: request.session.user })
})

app.post('/api/logout', (request, response) => {
  request.session.destroy(() => response.status(204).end())
})

app.get('/api/goods', async (request, response, next) => {
  try {
    response.json(await readJson(goodsPath))
  } catch (error) {
    next(error)
  }
})

app.get('/api/orders', requireAuth, async (request, response, next) => {
  try {
    const orders = await readJson(ordersPath)
    response.json(orders.filter((order) => order.user === request.session.user.username))
  } catch (error) {
    next(error)
  }
})

app.post('/api/orders', requireAuth, async (request, response, next) => {
  try {
    const orders = await readJson(ordersPath)
    const order = {
      id: orders.reduce((largest, item) => Math.max(largest, item.id), 405673) + 1,
      user: request.session.user.username,
      date: new Date().toISOString(),
      items: request.body.items,
      customer: request.body.customer,
      total: request.body.total
    }
    orders.unshift(order)
    await writeFile(ordersPath, JSON.stringify(orders, null, 2))
    response.status(201).json(order)
  } catch (error) {
    next(error)
  }
})

app.use((error, request, response, next) => {
  response.status(500).json({ message: 'Не удалось выполнить запрос' })
})

app.listen(port, () => {
  process.stdout.write(`Gadget Hub API: http://localhost:${port}\n`)
})
