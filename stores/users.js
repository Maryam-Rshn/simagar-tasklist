import { defineStore } from 'pinia'

export function userDisplayName(user) {
  if (!user?.email) {
    return 'Unassigned'
  }

  return user.email
    .split('@')[0]
    .split('.')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function userInitials(user) {
  const name = userDisplayName(user)
  if (name === 'Unassigned') {
    return '?'
  }

  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  const usersById = computed(() => {
    const map = {}
    for (const user of users.value) {
      map[user.id] = user
    }
    return map
  })

  async function fetchUsers() {
    if (users.value.length) {
      return users.value
    }

    loading.value = true
    error.value = null

    try {
      const { $api } = useNuxtApp()
      const { data } = await $api.get('/users')
      users.value = data
      return users.value
    } catch (err) {
      error.value = err.message || 'Failed to load users'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    error,
    usersById,
    fetchUsers,
  }
})
