<template >
  <div>
    <!-- header content -->
    <div class="header">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
      <h1>Todo List</h1>
      <div class="create-new">
        <input
          v-model="newTask"
          @keydown.enter="addTask"
          placeholder="Add new task..."
        />
        <button @click="addTask"><i class="fas fa-plus"></i> Add</button>
      </div>
    </div>
    <div class="tasks-container">
      <h4>List of Tasks</h4>
    <div class="tasks">
      <div
        v-for="(task, index) in tasks"
        :key="index"
        :class="{ 'task': true, 'is-complete': task.completed }"
      >
        <div class="content" :class="{ 'completed': task.completed }">
          <p :class="{ 'placeholder': task.text === '' }" :style="{ 'text-decoration': task.completed ? 'line-through' : 'none' }">{{ task.text }}</p>
        </div>
        <div class="buttons">
          <button @click="toggleTaskStatus(index)">Done</button>
          <button class="delete" @click="deleteTask(index)"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
    </div>
  </div>
    <div class="completed-tasks">
      <h4>Completed Tasks</h4>
      <div v-for="(completedTask, index) in completedTasks" :key="index" class="btnCompleteTask">
        <p> <i class="fas fa-check"></i>   {{ completedTask.text }}</p>
        <div>
          <button class="undo" @click="undoTask(index)"> <i class="fas fa-undo"></i> </button>
          <button class="delete" @click="deleteCompletedTask(index)"><i class="fas fa-trash-alt"></i></button>
      </div>
    </div>
    </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type Task = { text: string; completed: boolean };

const newTask = ref('');
const tasks = ref<Task[]>([]);
const completedTasks = ref<Task[]>([]);

const addTask = () => {
  if (newTask.value.trim() !== '') {
    tasks.value.push({ text: newTask.value, completed: false });
    newTask.value = '';
  }
};

const toggleTaskStatus = (index: number) => {
  const task = tasks.value[index];
  if (!task.completed) {
    task.completed = true;
    completedTasks.value.push(task);
    tasks.value.splice(index, 1);
  }
};

const undoTask = (index: number) => {
  const task = completedTasks.value[index];
  if (task) {
    completedTasks.value.splice(index, 1);
    task.completed = false;
    tasks.value.push(task);
  }
};

const deleteTask = (index: number) => {
  const source = tasks.value[index].completed ? 'completedTasks' : 'tasks';
  const task = source === 'tasks' ? tasks.value[index] : completedTasks.value[index];
  if (task) {
    tasks.value.splice(index, 1);
    completedTasks.value.splice(index, 1);
  }
};

const deleteCompletedTask = (index: number) => {
  completedTasks.value.splice(index, 1);
};


</script>

<style scoped>
  @import './assets/main.css';

  ::placeholder {
    color: rgb(119, 170, 151);
    font-size: 13px;
  }
</style>
