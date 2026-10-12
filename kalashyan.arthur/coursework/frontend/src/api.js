const apiUrl = `${window.location.protocol}//${window.location.hostname}:3000/api`

export const api = async (path, options = {}) => {
  const response = await fetch(`${apiUrl}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ошибка соединения с сервером' }))
    throw new Error(error.message)
  }
  return response.status === 204 ? null : response.json()
}
