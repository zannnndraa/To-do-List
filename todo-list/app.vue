
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
        <input v-model="newTask" @keydown.enter="addTask" placeholder="Add new task..." />
        <button @click="addTask"><i class="fas fa-plus"></i> Add</button>
      </div>
    </div>

    <!-- List of tasks -->
      <div class="tasks-container">
        <h4>Active Tasks</h4>
    <div class="tasks">
      <div
        v-for="(task, index) in tasks" :key="index" :class="{ 'task': true, 'is-complete': task.completed }">
        <!-- list -->
        <div class="content" :class="{ 'completed': task.completed }" >
        <p v-if="task && task.completed !== undefined" :style="{ 'text-decoration': task && task.completed ? 'line-through' : 'none' }">{{ task && task.text }}</p>
        <p class="task-date">{{ new Date(task.date).toLocaleDateString() }}</p>
          </div>
          <div class="buttons">
            <button @click="toggleTaskStatus(task.id, index)">Done</button>
            <button @click="editTask(task.id, index)"><i class="fa fa-edit"></i></button>
            <button class="delete" @click="deleteTask(task.id, index)"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </div>
    </div>

    <!-- completed tasks -->
   <div class="completed-tasks">
  <h4>Completed Tasks</h4>
  <div v-for="(completedTask, index) in completedTasks" :key="index" class="btnCompleteTask">
  <p v-if="completedTask && completedTask.text"> <i class="fas fa-check"></i>{{ completedTask.text }}</p>
  <div>
    <button class="undo" @click="undoTask(completedTask.id, index)">
      <i class="fas fa-undo"></i>
    </button>
    <button class="delete" @click="deleteCompletedTask(completedTask.id, index)">
      <i class="fas fa-trash-alt"></i>
    </button>
  </div>
</div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from './server/todos.js';

let nextTaskId = 0;

type Task = { id: number; text: string; completed: boolean; date: string };

const newTask = ref('');
const tasks = ref<Task[]>([]);
const completedTasks = ref<Task[]>([]);
  const generateTaskId = () => {
  const currentDate = new Date();
  const dateString = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
  const taskId = ++nextTaskId; 
  return taskId;
};



const addTask = async () => {
  if (newTask.value.trim() !== '') {
    const taskId = generateTaskId();

    const newTaskData = {
      id: taskId,
      text: newTask.value,
      completed: false,
      date: new Date().toISOString(),
    };

    tasks.value.push(newTaskData);
    newTask.value = '';

    try {
      const response = await fetch('/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTaskData),
      });

      if (!response.ok) {
        console.error('Error adding task to server:', response.statusText);
      } else {
        console.log('Task added to server successfully');
      }
    } catch (error) {
      console.error('Error adding task to server:', error);
    }
  }
};

const toggleTaskStatus = async (id: number, index: number) => {
  const task = tasks.value[index];

  try {
    const response = await api.patch(`/todos/${id}`, { completed: !task.completed });

    if (!task.completed) {
      task.completed = true;
      completedTasks.value.push(task);
      tasks.value.splice(index, 1);

      console.log('Task done!');
    }

  } catch (error) {
    console.error('Error toggling task status:', error);
  }
};

const undoTask = async (id: number, index: number) => {
  try {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: false }),
    });

    if (response.ok) {
      const completedTask = completedTasks.value[index];
      completedTasks.value.splice(index, 1);

      if (completedTask) {
        completedTask.completed = false;
        tasks.value.push(completedTask);
        console.log('Task undo successfully:', {
          text: completedTask.text,
          id: completedTask.id,
        });
      } else {
        console.error('Error undoing task: Task not found in completedTasks');
      }
    } else {
      console.error('Error undoing task:', response.statusText);
    }
  } catch (error) {
    console.error('Error undoing task:', error);
  }
};



const deleteTask = async (id: number, index: number) => {
  try {
    const response = await fetch(`/todos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error('Error deleting task from server:', response.statusText);
    } else {

      tasks.value.splice(index, 1);
      console.log('Task deleted from server successfully:', id);
    }
  } catch (error) {
    console.error('Error deleting task from server:', error);
  }
};


const deleteCompletedTask = async (id: number, index: number) => {
  try {
    const response = await fetch(`/todos/${id}`, {
      method: 'DELETE',
    });

    completedTasks.value.splice(index, 1);
    if (!response.ok) {
      console.error('Error deleting task from server:', response.statusText);
    } else {
      console.log('Task deleted from server successfully:', id);
    }
  } catch (error) {
    console.error('Error deleting task from server:', error);
  }
};

const editTask = async (id: number, index: number) => {
  const editedText = prompt('Edit task:', tasks.value[index].text); 
  if (editedText !== null) {
    const updatedTaskData = { ...tasks.value[index], text: editedText };

    try {
      const response = await fetch(`/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTaskData), 
      });

      if (!response.ok) {
        console.error('Error editing task on server:', response.statusText);
      } else {
   
        tasks.value[index] = updatedTaskData;
        console.log('Task edited on server successfully:', updatedTaskData);
      }
    } catch (error) {
      console.error('Error editing task on server:', error);
    }
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