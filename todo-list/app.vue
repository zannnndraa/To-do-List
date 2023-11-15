<template>
  <div>

    <!-- header -->
    <div class="header">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />

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

    <!-- List of tasks container -->
     <!-- Add the tasks container here -->
     <div class="tasks-container">
      <h4>Active Tasks</h4>
      <div class="tasks">
        <div v-for="(task, index) in tasks" :key="index" :class="{ 'task': true, 'is-complete': task.completed }">
          <div class="content" :class="{ 'completed': task.completed }">
            <p class="{ 'text-decoration': task.completed ? 'line-through' : 'none' }">{{ task.text }}</p>
          </div>
          <div class="buttons">
            <button @click="toggleTaskStatus(task.id)">Done</button>
            <button @click="editTask(task.id)"><i class="fa fa-edit"></i></button>
            <button class="delete" @click="deleteTask(task.id)"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </div>
    </div>
     <!-- Display completed tasks -->
     <div class="completed-tasks">
      <h4>Completed Tasks</h4>
      <div v-for="(completedTask, index) in completedTasks" :key="index" class="btnCompleteTask">
        <p> <i class="fas fa-check"></i>   {{ completedTask.text }}</p>
        <div>
          <button class="undo" @click="undoTask(completedTask.id)"> <i class="fas fa-undo"></i> </button>
          <button class="delete" @click="deleteCompletedTask(completedTask.id)"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
    </div>
   
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from './api/api';

type Task = { id: number; text: string; completed: boolean };

const newTask = ref('');
const tasks = ref<Task[]>([]);
const completedTasks = ref<Task[]>([]);

const addTask = async () => {
  if (newTask.value.trim() !== '') {
    const response = await api.post('/todos', {
      text: newTask.value,
      completed: false,
    });
    tasks.value.push(response.data);
    newTask.value = '';
  }
};

const toggleTaskStatus = async (id: number) => {
  const taskIndex = tasks.value.findIndex((task) => task.id === id);
  const task = tasks.value[taskIndex];
  if (!task.completed) {
    await api.put(`/todos/${id}`, { ...task, completed: true });
    task.completed = true;
    completedTasks.value.push(task);
    tasks.value.splice(taskIndex, 1);
  }
};

const undoTask = async (id: number) => {
  const taskIndex = completedTasks.value.findIndex((task) => task.id === id);
  const task = completedTasks.value[taskIndex];
  if (task) {
    await api.put(`/todos/${id}`, { ...task, completed: false });
    completedTasks.value.splice(taskIndex, 1);
    task.completed = false;
    tasks.value.push(task);
  }
};

const deleteTask = async (id: number) => {
  await api.delete(`/todos/${id}`);
  tasks.value = tasks.value.filter((task) => task.id !== id);
};

const deleteCompletedTask = async (id: number) => {
  await api.delete(`/todos/${id}`);
  completedTasks.value = completedTasks.value.filter((task) => task.id !== id);
};

const editTask = async (id: number) => {
  const taskIndex = tasks.value.findIndex((task) => task.id === id);
  const editedText = prompt('Edit task:', tasks.value[taskIndex].text);
  if (editedText !== null) {
    await api.put(`/todos/${id}`, { ...tasks.value[taskIndex], text: editedText });
    tasks.value[taskIndex].text = editedText;
  }
};
</script>



<style scoped>
  @import './assets/main.css';

  ::placeholder {
    color: rgb(119, 170, 151);
    font-size: 13px;
  }
</style>
