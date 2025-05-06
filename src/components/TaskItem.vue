<template>
  <li class="task-item" :class="{ completed: task.status === 'completed' }">
    <div class="task-header">
      <input
          type="checkbox"
          class="task-checkbox"
          :checked="task.status === 'completed'"
          @change="$emit('task-toggled', $event.target.checked)"
      />
      <span class="task-title" :class="{ completed: task.status === 'completed' }">
        {{ task.title }}
      </span>
      <span class="task-priority" :class="`priority-${task.priority}`">
        {{ task.priority }}
      </span>
      <span v-if="task.dueDate" class="task-due-date">
        {{ formatDate(task.dueDate) }}
      </span>
    </div>

    <div v-if="task.description" class="task-description">
      {{ task.description }}
    </div>

    <div class="task-footer">
      <span class="task-status">
        {{ task.status === 'completed' ? 'Completed' : 'Pending' }}
      </span>
      <button class="delete-btn" @click="$emit('task-deleted')">
        Delete
      </button>
    </div>
  </li>
</template>

<script setup>
defineProps({
  task: {
    type: Object,
    required: true
  }
})

defineEmits(['task-toggled', 'task-deleted'])

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>

<style scoped>
.task-item {
  padding: 15px;
  border: 1px solid #eee;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.task-item.completed {
  background-color: #e8f5e9;
}

.task-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.task-checkbox {
  margin-right: 10px;
  cursor: pointer;
}

.task-title {
  flex-grow: 1;
  font-weight: bold;
  font-size: 18px;
}

.task-title.completed {
  text-decoration: line-through;
  color: #888;
}

.task-priority {
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.priority-low {
  background-color: #d4edda;
  color: #155724;
}

.priority-medium {
  background-color: #fff3cd;
  color: #856404;
}

.priority-high {
  background-color: #f8d7da;
  color: #721c24;
}

.task-due-date {
  font-size: 14px;
  color: #666;
  margin-left: 10px;
}

.task-description {
  color: #555;
  margin: 10px 0;
  line-height: 1.5;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #ddd;
}

.delete-btn {
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #cc0000;
}

.task-status {
  font-size: 12px;
  color: #666;
  font-style: italic;
}
</style>