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
        v-for="(task, index) in tasks"
        :key="index"
        :class="{ 'task': true, 'is-complete': task.completed }"
      >
        <div class="content" :class="{ 'completed': task.completed }">
          <p :style="{ 'text-decoration': task.completed ? 'line-through' : 'none' }">{{ task.text }}</p>
          <p class="task-date">{{ task.date }}</p> 
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
          <p> <i class="fas fa-check"></i> {{ completedTask.text }}</p>
          <div>
            <button class="undo" @click="undoTask(completedTask.id, index)"> <i class="fas fa-undo"></i> </button>
            <button class="delete" @click="deleteCompletedTask(completedTask.id, index)"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import { ref } from 'vue';
  import api from './server/todos';

  let nextTaskId = 1;

  type Task = { id: number; text: string; completed: boolean; date: string };


  const newTask = ref('');
  const tasks = ref<Task[]>([]);
  const completedTasks = ref<Task[]>([]);

  const generateTaskId = () => {
    const currentDate = new Date();
    const dateString = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    return `${dateString}-${nextTaskId++}`;
  };


  const addTask = async () => {
    
  if (newTask.value.trim() !== '') {
    const taskId = generateTaskId();
    const currentDate = new Date();
    const date = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

    try {
      const response = await api.post('/todos', {
        id: taskId,
        text: newTask.value,
        completed: false,
        date: date,
      });

      const addedTask = response;

      tasks.value.push(addedTask);
      newTask.value = '';
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }
};

  const toggleTaskStatus = async (id: number, index: number) => {
    const task = tasks.value[index];
    try {
      const response = await api.patch(`/todos/${id}`, { completed: !task.completed });

      tasks.value.splice(index, 1);
      if (!task.completed) {
        const completedTask = response.data;
        completedTasks.value.push(completedTask);
      } else {
        completedTasks.value = completedTasks.value.filter(
          (completedTask) => completedTask.id !== id
        );
        tasks.value.push(response.data);
      }
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };
  const undoTask = async (id: number, index: number) => {
    const task = completedTasks.value[index];
    if (task) {
      try {
        const response = await api.patch(`/todos/${id}`, { completed: false });
        completedTasks.value.splice(index, 1);
        task.completed = false;
        tasks.value.push(task);
      } catch (error) {
        console.error('Error undoing task:', error);
      }
    }
  };

  const deleteTask = async (id: number, index: number) => {
    try {
      await api.delete(`/todos/${id}`);
      tasks.value.splice(index, 1);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const deleteCompletedTask = async (id: number, index: number) => {
    try {
      await api.delete(`/todos/${id}`);
      completedTasks.value.splice(index, 1);
    } catch (error) {
      console.error('Error deleting completed task:', error);
    }
  };

  const editTask = async (id: number, index: number) => {
    const editedText = prompt('Edit task:', tasks.value[index].text);
    if (editedText !== null) {
      try {
        const response = await api.patch(`/todos/${id}`, { ...tasks.value[index], text: editedText });
        tasks.value[index] = response.data; 
      } catch (error) {
        console.error('Error editing task:', error);
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
