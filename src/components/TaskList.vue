<template>
  <ul id="taskList">
    <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @task-toggled="$emit('task-toggled', task.id, $event)"
        @task-deleted="$emit('task-deleted', task.id)"
    />
  </ul>
</template>

<script setup>
import TaskItem from './TaskItem.vue'

defineProps({
  tasks: {
    type: Array,
    required: true
  }
})

defineEmits(['task-toggled', 'task-deleted'])
</script>

<style scoped>
#taskList {
  list-style-type: none;
  padding: 0;
}
</style>