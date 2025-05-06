<template>
  <div class="task-form">
    <input type="text" v-model="title" placeholder="Task title" required>
    <textarea v-model="description" placeholder="Task description" required></textarea>
    <div class="form-row">
      <div>
        <label for="taskDueDate">Due Date:</label>
        <input type="date" id="taskDueDate" v-model="dueDate" required>
      </div>
      <div>
        <label for="taskPriority">Priority:</label>
        <select id="taskPriority" v-model="priority">
          <option value="low">Low</option>
          <option value="mid" selected>Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
    <button @click="addTask" id="addButton">ADD TASK</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createTask } from '@/services/tasks'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const title = ref('')
const description = ref('')
const dueDate = ref('')
const priority = ref('mid')

const emit = defineEmits(['task-added'])

async function addTask() {
  if (!title.value.trim()) {
    alert("Please enter a task title")
    return
  }

  if (!authStore.isAuthenticated) {
    alert("You must be logged in")
    return
  }

  const taskData = {
    title: title.value,
    description: description.value,
    priority: priority.value,
    status: "pending",
    dueDate: dueDate.value,
    creator: { id: authStore.currentUser.userId },
    executor: { id: authStore.currentUser.userId }
  }

  try {
    await createTask(taskData, authStore.currentUser.accessToken)
    emit('task-added')
    alert("Task created and saved in database!")

    // Clear fields
    title.value = ''
    description.value = ''
    dueDate.value = ''
    priority.value = 'mid'
  } catch (error) {
    console.error("Failed to save task:", error)
    alert(error.message || "Network error occurred")
  }
}
</script>

<style scoped>
.task-form {
  margin-bottom: 25px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.task-form input[type="text"],
.task-form textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.task-form textarea {
  min-height: 80px;
  resize: vertical;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-row > div {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input[type="date"],
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

#addButton {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}

#addButton:hover {
  background-color: #45a049;
}
</style>