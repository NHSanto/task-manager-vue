<template>
  <div class="app-container">
    <header>
      <h1>Task Manager</h1>
      <div class="user-info">
        <span>{{ authStore.currentUser.email }}</span>
        <button @click="logout" id="logout-btn">Logout</button>
      </div>
    </header>
    <div class="container">
      <TaskForm @task-added="loadTasks" />

      <div class="tabs">
        <div
            v-for="tab in tabs"
            :key="tab.value"
            class="tab"
            :class="{ active: currentTab === tab.value }"
            @click="currentTab = tab.value"
        >
          {{ tab.label }}
        </div>
      </div>

      <div class="task-controls">
        <span id="taskCount">{{ filteredTasks.length }} tasks ({{ activeTaskCount }} active)</span>
        <div class="pagination">
          <button id="prevPage" :disabled="currentPage === 1" @click="prevPage">Previous</button>
          <span id="pageInfo">Page {{ currentPage }}</span>
          <button id="nextPage" :disabled="currentPage === totalPages" @click="nextPage">Next</button>
        </div>
      </div>

      <TaskList
          :tasks="paginatedTasks"
          @task-toggled="toggleTaskComplete"
          @task-deleted="deleteTask"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import TaskForm from '@/components/TaskForm.vue'
import TaskList from '@/components/TaskList.vue'
import { fetchTasks, createTask, updateTaskStatus, deleteTask as deleteTaskApi } from '@/services/tasks'

const authStore = useAuthStore()
const router = useRouter()

const tasks = ref([])
const currentTab = ref('all')
const currentPage = ref(1)
const tasksPerPage = 5

const tabs = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' }
]

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    if (currentTab.value === 'all') return true
    if (currentTab.value === 'active') return task.status !== 'completed'
    if (currentTab.value === 'completed') return task.status === 'completed'
    return true
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredTasks.value.length / tasksPerPage)
})

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * tasksPerPage
  const end = start + tasksPerPage
  return filteredTasks.value.slice(start, end)
})

const activeTaskCount = computed(() => {
  return tasks.value.filter(task => task.status !== 'completed').length
})

onMounted(() => {
  loadTasks()
})

async function loadTasks() {
  if (!authStore.isAuthenticated) return

  try {
    const data = await fetchTasks(authStore.currentUser)
    tasks.value = data.content
  } catch (error) {
    console.error("Error fetching tasks:", error)
  }
}

async function toggleTaskComplete(taskId, isChecked) {
  const status = isChecked ? "completed" : "pending"
  try {
    const updatedTask = await updateTaskStatus(taskId, status, authStore.currentUser.accessToken)

    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }
  } catch (error) {
    console.error("Error updating task status:", error)
    throw error
  }
}

async function deleteTask(taskId) {
  try {
    await deleteTaskApi(taskId, authStore.currentUser.accessToken)
    tasks.value = tasks.value.filter(t => t.id !== taskId)
  } catch (error) {
    console.error("Error deleting task:", error)
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

async function logout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

#logout-btn {
  padding: 0.5rem 1rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

#logout-btn:hover {
  background-color: #d32f2f;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  margin-right: 5px;
}

.tab.active {
  background-color: white;
  border-bottom: 1px solid white;
  margin-bottom: -1px;
  font-weight: bold;
}

.task-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 10px;
}

#taskCount {
  color: #666;
  font-size: 14px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 3px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>